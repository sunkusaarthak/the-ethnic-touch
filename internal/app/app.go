package app

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"strings"
	"time"

	"ethnictouch/internal/config"
	"ethnictouch/internal/cron"
	"ethnictouch/internal/handlers"
	"ethnictouch/internal/middleware"
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
	"ethnictouch/internal/service"
)

type App struct {
	DB           *sql.DB
	Router       *http.ServeMux
	Config       *config.Config
	Logger       *slog.Logger
	HTTPServer   *http.Server
	OrderService service.OrderService
	jobsCtx      context.Context
	cancelJobs   context.CancelFunc
}

func NewApp(cfg *config.Config, logger *slog.Logger) (*App, error) {
	db, err := repository.InitDB(cfg)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithCancel(context.Background())

	app := &App{
		DB:           db,
		Router:       http.NewServeMux(),
		Config:       cfg,
		Logger:       logger,
		OrderService: nil, // set in setupRoutes
		jobsCtx:      ctx,
		cancelJobs:   cancel,
	}

	app.setupRoutes()
	return app, nil
}

func (a *App) setupRoutes() {
	// Repositories
	productRepo := repository.NewProductRepository(a.DB)
	orderRepo := repository.NewOrderRepository(a.DB)
	couponRepo := repository.NewCouponRepository(a.DB)
	profileRepo := repository.NewProfileRepository(a.DB)
	cartRepo := repository.NewCartRepository(a.DB)
	configRepo := repository.NewConfigRepository(a.DB)
	contactRepo := repository.NewContactRepository(a.DB)

	delhiverySvc := service.NewDelhiveryService(a.Config.DelhiveryWebhookSecret, a.Config.DelhiveryAPIKey, a.Config.ShippingProvider)

	// Services
	configSvc := service.NewConfigService(configRepo)
	productSvc := service.NewProductService(productRepo)
	couponSvc := service.NewCouponService(couponRepo)
	orderSvc := service.NewOrderService(orderRepo, couponSvc, productRepo, configSvc, delhiverySvc)
	cron.StartDelhiveryCron(a.jobsCtx, orderSvc)
	saleStore := repository.SaleStore{DB: a.DB}
	orderSvc.SetSaleLoader(saleStore.Load)
	profileSvc := service.NewProfileService(profileRepo)
	cartSvc := service.NewCartService(cartRepo)
	contactSvc := service.NewContactService(contactRepo)
	emailSvc := service.NewEmailService(a.Config)
	if !emailSvc.IsConfigured() {
		a.Logger.Warn("Order emails are disabled: configure GMAIL_USER and GMAIL_APP_PASSWORD")
	}
	orderSvc.SetPaymentConfirmedHandler(func(order *models.Order) {
		if emailSvc.IsConfigured() {
			go func(confirmed models.Order) {
				// Keep the confirmed status snapshot when reloading order items.
				if len(confirmed.Items) == 0 {
					fullOrder, err := orderSvc.GetOrder(confirmed.ID)
					if err != nil {
						a.Logger.Error("Could not load items for order confirmation", "order_id", confirmed.ID, "error", err)
					} else {
						confirmed.Items = fullOrder.Items
					}
				}
				if err := emailSvc.SendOrderConfirmation(&confirmed); err != nil {
					a.Logger.Error("Could not send order confirmation", "order_id", confirmed.ID, "error", err)
				}
			}(*order)
		}
		if err := configSvc.IncrementOrderKurthiCounter(); err != nil {
			a.Logger.Error("Could not update the order counter", "order_id", order.ID, "error", err)
		}
	})

	adminUserRepo := repository.NewAdminUserRepository(a.DB)

	// Handlers
	productHandler := handlers.NewProductHandler(productSvc)
	orderHandler := handlers.NewOrderHandler(orderSvc, profileSvc, configSvc, delhiverySvc, emailSvc)
	couponHandler := handlers.NewCouponHandler(couponSvc)
	profileHandler := handlers.NewProfileHandler(profileSvc, configSvc)
	cartHandler := handlers.NewCartHandler(cartSvc)
	spinHandler := handlers.NewSpinHandler(profileSvc, couponSvc, configSvc)
	configHandler := handlers.NewConfigHandler(configSvc, couponSvc)
	configHandler.SetFlashCatalog(productSvc)
	staffHandler := handlers.NewStaffHandler(adminUserRepo)
	contactHandler := handlers.NewContactHandler(contactSvc)
	sitemapHandler := handlers.NewSitemapHandler(productSvc)
	ogHandler := handlers.NewOgHandler(productSvc)

	// Ensure active homepage welcome coupon exists and is active in coupons repository
	if hpConfig, err := configSvc.GetHomepageConfig(); err == nil && hpConfig.VipVoucher.Code != "" {
		code := strings.ToUpper(strings.TrimSpace(hpConfig.VipVoucher.Code))
		disc := float64(hpConfig.VipVoucher.DiscountPercent)
		if disc <= 0 {
			disc = 10
		}
		_ = couponSvc.CreateCoupon(&models.Coupon{
			ID:         "cp_" + strings.ToLower(code),
			Code:       code,
			Type:       "percentage",
			Value:      disc,
			MinOrder:   0,
			IsActive:   true,
			UsageLimit: 100000,
		})
	}

	adminOnly := middleware.AdminAuthMiddleware(a.Config.SuperAdminEmail, adminUserRepo, "admin")
	adminOrEmployee := middleware.AdminAuthMiddleware(a.Config.SuperAdminEmail, adminUserRepo, "admin", "employee")
	customerAuth := middleware.CustomerAuthMiddleware
	a.Router.HandleFunc("/api/config/sale", handlers.SaleHandler(saleStore, false))
	a.Router.Handle("/api/admin/config/sale", adminOnly(handlers.SaleHandler(saleStore, true)))

	a.OrderService = orderSvc

	// API Routes (Manual Method Dispatch for Go 1.21 compatibility on Render)
	a.Router.HandleFunc("/api/products", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			productHandler.HandleProducts(w, r)
		} else {
			adminOnly(http.HandlerFunc(productHandler.HandleProducts)).ServeHTTP(w, r)
		}
	})

	a.Router.HandleFunc("/api/products/{id}", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodDelete {
			adminOnly(http.HandlerFunc(productHandler.HandleProductByID)).ServeHTTP(w, r)
		} else {
			productHandler.HandleProductByID(w, r)
		}
	})
	a.Router.HandleFunc("/api/products/{id}/reviews", productHandler.HandleProductReviews)

	rateLimiter := middleware.NewRateLimiter(30, time.Minute)

	// Orders & Checkout
	a.Router.HandleFunc("/api/checkout/shipping-estimate", orderHandler.HandleShippingEstimate)
	a.Router.HandleFunc("/api/checkout/shipping-timeline", orderHandler.HandleShippingTimeline)
	a.Router.HandleFunc("/api/webhooks/delhivery", orderHandler.HandleDelhiveryWebhook)
	a.Router.HandleFunc("/api/webhooks/razorpay", orderHandler.HandleRazorpayWebhook)

	a.Router.Handle("/api/orders", rateLimiter.Limit(customerAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			orderHandler.HandleGetOrder(w, r)
		} else {
			orderHandler.HandleCheckout(w, r)
		}
	}))))
	a.Router.Handle("/api/orders/create", rateLimiter.Limit(customerAuth(http.HandlerFunc(orderHandler.HandleCheckout))))
	a.Router.Handle("/api/checkout", rateLimiter.Limit(customerAuth(http.HandlerFunc(orderHandler.HandleCheckout))))

	a.Router.Handle("/api/orders/verify", rateLimiter.Limit(customerAuth(http.HandlerFunc(orderHandler.HandleVerifyPayment))))
	a.Router.Handle("/api/verify-payment", rateLimiter.Limit(customerAuth(http.HandlerFunc(orderHandler.HandleVerifyPayment))))

	a.Router.Handle("/api/orders/{id}/cancel", rateLimiter.Limit(customerAuth(http.HandlerFunc(orderHandler.HandleCancelOrder))))
	a.Router.Handle("/api/orders/cancel", rateLimiter.Limit(customerAuth(http.HandlerFunc(orderHandler.HandleCancelOrder))))

	a.Router.Handle("/api/profile/orders", customerAuth(http.HandlerFunc(orderHandler.HandleGetOrder)))

	// Coupons & Gifting
	a.Router.HandleFunc("/api/gift-tiers", couponHandler.HandleGetGiftTiers)
	a.Router.HandleFunc("/api/admin/gift-tiers", adminOnly(http.HandlerFunc(couponHandler.HandleUpdateGiftTiers)).ServeHTTP)
	a.Router.HandleFunc("/api/coupons/validate", rateLimiter.Limit(http.HandlerFunc(couponHandler.HandleValidateCoupon)).ServeHTTP)

	// Spin the Wheel
	a.Router.Handle("/api/spin-wheel", rateLimiter.Limit(customerAuth(http.HandlerFunc(spinHandler.HandleSpin))))

	// Admin API Endpoints
	a.Router.HandleFunc("/api/admin/orders", adminOrEmployee(http.HandlerFunc(orderHandler.HandleGetOrder)).ServeHTTP)
	a.Router.Handle("GET /api/admin/orders/alerts", adminOrEmployee(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()
		ids, err := repository.RecentConfirmedOrderIDs(ctx, a.DB)
		if err != nil {
			a.Logger.Error("Could not check confirmed orders for admin alerts", "error", err)
			http.Error(w, "Could not check order alerts", http.StatusServiceUnavailable)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(ids); err != nil {
			a.Logger.Debug("Could not send order alerts", "error", err)
		}
	})))
	a.Router.HandleFunc("/api/admin/orders/confirm-pickup", adminOrEmployee(http.HandlerFunc(orderHandler.HandleConfirmPickup)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/delhivery/batch-pickup", adminOnly(http.HandlerFunc(orderHandler.HandleTriggerDelhiveryBatch)).ServeHTTP)
	a.Router.Handle("/api/admin/delhivery/resolve-dispatch", adminOnly(http.HandlerFunc(orderHandler.HandleResolveDelhiveryDispatch)))

	a.Router.HandleFunc("/api/admin/profiles", adminOnly(http.HandlerFunc(profileHandler.HandleAdminProfiles)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/profiles/edit", adminOnly(http.HandlerFunc(profileHandler.HandleAdminProfileEdit)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/profiles/details", adminOnly(http.HandlerFunc(profileHandler.HandleAdminProfileDetails)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/profiles/delete", adminOnly(http.HandlerFunc(profileHandler.HandleAdminProfileDelete)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/upload", adminOnly(http.HandlerFunc(productHandler.HandleAdminUpload)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/coupons", adminOnly(http.HandlerFunc(couponHandler.HandleAdminCoupons)).ServeHTTP)

	// Staff Management
	a.Router.HandleFunc("/api/admin/staff", adminOnly(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			staffHandler.HandleGetStaff(w, r)
		} else if r.Method == http.MethodPost {
			staffHandler.HandleAddStaff(w, r)
		} else if r.Method == http.MethodDelete {
			staffHandler.HandleDeleteStaff(w, r)
		}
	})).ServeHTTP)

	// Contact Us Endpoints
	a.Router.HandleFunc("/api/contact", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			contactHandler.HandlePostContact(w, r)
		}
	})
	a.Router.HandleFunc("/api/admin/contact", adminOrEmployee(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			contactHandler.HandleAdminGetMessages(w, r)
		}
	})).ServeHTTP)
	a.Router.HandleFunc("/api/admin/contact/{id}/read", adminOrEmployee(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			contactHandler.HandleAdminMarkRead(w, r)
		}
	})).ServeHTTP)

	// Staff Identity
	a.Router.HandleFunc("/api/admin/me", adminOrEmployee(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role := r.Context().Value(middleware.RoleKey).(string)
		email := r.Context().Value(middleware.EmailKey).(string)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"email": email, "role": role})
	})).ServeHTTP)

	// Config API Endpoints
	a.Router.HandleFunc("/api/config/spin-wheel", configHandler.HandleGetSpinConfig)
	a.Router.Handle("/api/admin/config/spin-wheel", adminOnly(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			configHandler.HandleGetAdminSpinConfig(w, r)
			return
		}
		configHandler.HandleUpdateSpinConfig(w, r)
	})))
	a.Router.HandleFunc("/api/admin/config/spin-wheel/stats", adminOnly(http.HandlerFunc(configHandler.HandleGetSpinStats)).ServeHTTP)

	a.Router.HandleFunc("/api/config/auth", configHandler.HandleGetAuthConfig)
	a.Router.HandleFunc("/api/admin/config/auth", adminOnly(http.HandlerFunc(configHandler.HandleUpdateAuthConfig)).ServeHTTP)

	a.Router.HandleFunc("/api/config/checkout", configHandler.HandleGetCheckoutConfig)
	a.Router.HandleFunc("/api/admin/config/checkout", adminOnly(http.HandlerFunc(configHandler.HandleUpdateCheckoutConfig)).ServeHTTP)

	a.Router.HandleFunc("/api/config/homepage", configHandler.HandleGetHomepageConfig)
	a.Router.HandleFunc("/api/admin/config/homepage", adminOnly(http.HandlerFunc(configHandler.HandleUpdateHomepageConfig)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/config/flash-drop", adminOnly(http.HandlerFunc(configHandler.HandleFlashDropConfig)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/config/instagram", adminOnly(http.HandlerFunc(configHandler.HandleUpdateInstagramConfig)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/reels/fetch-thumbnail", adminOnly(http.HandlerFunc(configHandler.HandleFetchInstagramThumbnail)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/reels/sync-thumbnails", adminOnly(http.HandlerFunc(configHandler.HandleSyncAllInstagramThumbnails)).ServeHTTP)
	a.Router.HandleFunc("/api/reels/video-url", configHandler.HandleGetInstagramReelVideo)

	// Preorder Pickup Config
	a.Router.HandleFunc("/api/config/preorder-pickup", configHandler.HandleGetPreorderPickupConfig)
	a.Router.HandleFunc("/api/admin/config/preorder-pickup", adminOnly(http.HandlerFunc(configHandler.HandleUpdatePreorderPickupConfig)).ServeHTTP)

	// Preorder Pickup Management
	a.Router.HandleFunc("/api/admin/preorder/orders", adminOrEmployee(http.HandlerFunc(orderHandler.HandleGetPreorderOrders)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/preorder/orders/{id}/audit", adminOrEmployee(http.HandlerFunc(orderHandler.HandleGetPreorderPickupAudit)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/preorder/mark-ready", adminOnly(http.HandlerFunc(orderHandler.HandleMarkPreorderPickupReady)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/preorder/mark-all-ready", adminOnly(http.HandlerFunc(orderHandler.HandleMarkAllPreorderPickupReady)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/preorder/confirm-pickup", adminOnly(http.HandlerFunc(orderHandler.HandleConfirmPreorderPickup)).ServeHTTP)

	// User Profiles & Addresses
	a.Router.Handle("/api/profile", customerAuth(http.HandlerFunc(profileHandler.HandleProfile)))
	a.Router.Handle("/api/profile/me", customerAuth(http.HandlerFunc(profileHandler.HandleProfile)))
	a.Router.Handle("/api/addresses", customerAuth(http.HandlerFunc(profileHandler.HandleAddresses)))
	a.Router.Handle("/api/profile/addresses", customerAuth(http.HandlerFunc(profileHandler.HandleAddresses)))
	a.Router.Handle("/api/profile/coupons", customerAuth(http.HandlerFunc(couponHandler.HandleUserCoupons)))

	// Cart & Wishlist (Protected with CustomerAuthMiddleware against IDOR)
	a.Router.Handle("/api/cart", customerAuth(http.HandlerFunc(cartHandler.HandleCart)))
	a.Router.Handle("/api/cart/merge", customerAuth(http.HandlerFunc(cartHandler.HandleCart)))

	a.Router.Handle("/api/wishlist", customerAuth(http.HandlerFunc(cartHandler.HandleWishlist)))
	a.Router.Handle("/api/wishlist/merge", customerAuth(http.HandlerFunc(cartHandler.HandleWishlist)))

	// Health check endpoint
	a.Router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		status := "up"
		dbStatus := "connected"
		if err := a.DB.Ping(); err != nil {
			status = "degraded"
			dbStatus = "disconnected"
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"` + status + `", "database":"` + dbStatus + `"}`))
	})

	// SEO Sitemap & OG Images
	a.Router.HandleFunc("/sitemap.xml", sitemapHandler.HandleSitemap)
	a.Router.HandleFunc("/api/og-image/", ogHandler.HandleOgImage)

	// Dev Email Preview Endpoint (For testing & mobile preview in browser)
	previewHandler := func(w http.ResponseWriter, r *http.Request) {
		previewType := r.URL.Query().Get("type")
		view := r.URL.Query().Get("view")
		if view == "hub" || previewType == "hub" || (previewType == "" && !r.URL.Query().Has("type")) {
			if hubBytes, err := os.ReadFile("email_previews/index.html"); err == nil {
				w.Header().Set("Content-Type", "text/html; charset=utf-8")
				w.Write(hubBytes)
				return
			}
		}
		if previewType == "" {
			previewType = "prepaid_pickup"
		}
		_, html, err := emailSvc.GeneratePreview(previewType)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte(html))
	}

	a.Router.HandleFunc("/api/dev/email-preview", previewHandler)
	a.Router.HandleFunc("/dev/email-preview", previewHandler)
	a.Router.HandleFunc("/email-preview", previewHandler)

	// Static file server fallback for SPA & Admin Portal
	frontendDist := "./frontend/dist"
	frontendPublic := "./frontend/public"

	fsDist := http.FileServer(http.Dir(frontendDist))
	fsPublic := http.FileServer(http.Dir(frontendPublic))

	a.Router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// Canonical redirect /admin -> /admin/
		if path == "/admin" {
			http.Redirect(w, r, "/admin/", http.StatusMovedPermanently)
			return
		}

		// Direct match for /admin/ or /admin/index.html
		if path == "/admin/" || path == "/admin/index.html" {
			adminFile := frontendPublic + "/admin/index.html"
			if _, err := os.Stat(frontendDist + "/admin/index.html"); err == nil {
				adminFile = frontendDist + "/admin/index.html"
			}
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
			http.ServeFile(w, r, adminFile)
			return
		}

		// Helper function to set cache-control headers based on asset path
		setCacheHeaders := func(filePath string) {
			if strings.HasPrefix(filePath, "/assets/") {
				// Vite hashed assets (JS/CSS/fonts) are immutable
				w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			} else if strings.HasPrefix(filePath, "/images/") || strings.HasSuffix(filePath, ".png") || strings.HasSuffix(filePath, ".jpg") || strings.HasSuffix(filePath, ".jpeg") || strings.HasSuffix(filePath, ".webp") || strings.HasSuffix(filePath, ".svg") || strings.HasSuffix(filePath, ".ico") {
				// Static images and icons
				w.Header().Set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800")
			} else {
				// HTML, unhashed admin files (admin.js, admin.css), and configs must NEVER be cached by browser
				w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
				w.Header().Set("Pragma", "no-cache")
				w.Header().Set("Expires", "0")
			}
		}

		// Direct match for root or /index.html (always no-cache so clients receive updated index immediately)
		if path == "/" || path == "/index.html" {
			w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
			w.Header().Set("Pragma", "no-cache")
			w.Header().Set("Expires", "0")
			htmlPath := frontendDist + "/index.html"
			if _, err := os.Stat(htmlPath); err != nil {
				htmlPath = frontendPublic + "/index.html"
			}
			http.ServeFile(w, r, htmlPath)
			return
		}

		// Check if file exists in frontend/dist
		if _, err := os.Stat(frontendDist + path); err == nil && path != "/" {
			setCacheHeaders(path)
			fsDist.ServeHTTP(w, r)
			return
		}

		// Check if file exists in frontend/public
		if _, err := os.Stat(frontendPublic + path); err == nil && path != "/" {
			setCacheHeaders(path)
			fsPublic.ServeHTTP(w, r)
			return
		}

		// Fallback for React SPA (always no-cache so clients receive updated index immediately)
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")

		// Fallback for React SPA
		htmlPath := frontendDist + "/index.html"
		if _, err := os.Stat(htmlPath); err != nil {
			htmlPath = frontendPublic + "/index.html"
			if _, err := os.Stat(htmlPath); err != nil {
				http.NotFound(w, r)
				return
			}
		}

		// Inject dynamic Open Graph tags for product pages
		if strings.HasPrefix(path, "/product/") {
			idStr := strings.TrimPrefix(path, "/product/")
			if idx := strings.Index(idStr, "/"); idx != -1 {
				idStr = idStr[:idx] // Extract just the ID if slug is present
			}
			if idStr != "" {
				product, err := productRepo.GetProductByID(idStr)
				if err == nil && product != nil {
					// Read the html file
					htmlBytes, err := os.ReadFile(htmlPath)
					if err == nil {
						htmlContent := string(htmlBytes)
						// Create dynamic meta tags
						imageURL := "https://www.theethnictouch.com/api/og-image/" + product.ID + ".jpg"

						// Check availability for Schema
						availability := "https://schema.org/OutOfStock"
						for _, stock := range product.SizesStock {
							if stock > 0 {
								availability = "https://schema.org/InStock"
								break
							}
						}

						// JSON-LD structured data for Google Search Rich Snippets
						jsonLD := fmt.Sprintf(`
							<script type="application/ld+json">
							{
								"@context": "https://schema.org/",
								"@type": "Product",
								"name": "%s",
								"image": "%s",
								"description": "%s",
								"brand": {
									"@type": "Brand",
									"name": "The Ethnic Touch"
								},
								"offers": {
									"@type": "Offer",
									"url": "%s",
									"priceCurrency": "INR",
									"price": "%f",
									"availability": "%s"
								}
							}
							</script>
						`, product.Name, imageURL, product.Description, "https://www.theethnictouch.com"+path, product.Price, availability)

						twitterPrice := fmt.Sprintf("₹%.0f", product.Price)
						dynamicTags := fmt.Sprintf(`
							<title>%s | The Ethnic Touch</title>
							<meta name="description" content="%s">
							<meta property="og:title" content="%s">
							<meta property="og:description" content="%s">
							<meta property="og:image" content="%s">
							<meta property="og:url" content="%s">
							<meta property="og:type" content="product">
							<meta property="product:price:amount" content="%f">
							<meta property="product:price:currency" content="INR">
							<meta property="product:availability" content="%s">
							<meta name="twitter:card" content="summary_large_image">
							<meta name="twitter:title" content="%s">
							<meta name="twitter:description" content="%s">
							<meta name="twitter:image" content="%s">
							<meta name="twitter:label1" content="Price">
							<meta name="twitter:data1" content="%s">
							%s
						`, product.Name, product.Description, product.Name, product.Description, imageURL, "https://www.theethnictouch.com"+path, product.Price, availability, product.Name, product.Description, imageURL, twitterPrice, jsonLD)
						htmlContent = strings.Replace(htmlContent, "<!-- DYNAMIC_META_TAGS -->", dynamicTags, 1)

						w.Header().Set("Content-Type", "text/html; charset=utf-8")
						w.Write([]byte(htmlContent))
						return
					}
				}
			}
		}

		// Serve normal file if no dynamic injection happened
		http.ServeFile(w, r, htmlPath)
	})
}

func (a *App) Run(port string) error {
	a.Logger.Info("Starting server", slog.String("port", port))
	handler := middleware.TracingMiddleware(middleware.LoggingMiddleware(a.Logger)(middleware.PanicRecoveryMiddleware(a.Logger)(middleware.SecurityHeadersMiddleware(middleware.CORSMiddleware(a.Router)))))

	a.HTTPServer = &http.Server{
		Addr:    ":" + port,
		Handler: handler,
	}

	return a.HTTPServer.ListenAndServe()
}

func (a *App) StartBackgroundJobs() {
	if a.OrderService != nil && a.Config.DelhiveryAPIKey != "" && a.Config.ShippingProvider != "mock" {
		go func() {
			ticker := time.NewTicker(5 * time.Minute)
			defer ticker.Stop()
			for {
				if err := a.OrderService.RefreshShipmentTracking(a.jobsCtx); err != nil && a.jobsCtx.Err() == nil {
					a.Logger.Warn("Could not refresh shipment tracking", "error", err)
				}
				select {
				case <-a.jobsCtx.Done():
					return
				case <-ticker.C:
				}
			}
		}()
	}
	go func() {
		// Run initial cleanup immediately upon startup (useful when waking up from Render spin-down)
		if a.OrderService != nil {
			cleaned, err := a.OrderService.CleanupAbandonedOrders(15 * time.Minute)
			if err != nil {
				a.Logger.Error("Failed initial cleanup of abandoned orders", "error", err)
			} else if cleaned > 0 {
				a.Logger.Info("Cleaned abandoned orders on server startup", "count", cleaned)
			}
		}

		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		for {
			select {
			case <-a.jobsCtx.Done():
				return
			case <-ticker.C:
				if a.OrderService != nil {
					cleaned, err := a.OrderService.CleanupAbandonedOrders(15 * time.Minute)
					if err != nil {
						a.Logger.Error("Failed to cleanup abandoned orders", "error", err)
					} else if cleaned > 0 {
						a.Logger.Info("Cleaned abandoned orders", "count", cleaned)
					}
				}
			}
		}
	}()
}

func (a *App) Shutdown(ctx context.Context) error {
	if a.cancelJobs != nil {
		a.cancelJobs()
	}
	if a.HTTPServer != nil {
		return a.HTTPServer.Shutdown(ctx)
	}
	return nil
}
