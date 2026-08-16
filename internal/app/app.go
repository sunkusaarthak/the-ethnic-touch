package app

import (
	"context"
	"database/sql"
	"encoding/json"
	"log/slog"
	"net/http"
	"os"
	"time"

	"ethnictouch/internal/config"
	"ethnictouch/internal/handlers"
	"ethnictouch/internal/middleware"
	"ethnictouch/internal/repository"
	"ethnictouch/internal/service"
)

type App struct {
	DB         *sql.DB
	Router     *http.ServeMux
	Config       *config.Config
	Logger       *slog.Logger
	HTTPServer   *http.Server
	OrderService service.OrderService
}

func NewApp(cfg *config.Config, logger *slog.Logger) (*App, error) {
	db, err := repository.InitDB(cfg)
	if err != nil {
		return nil, err
	}

	app := &App{
		DB:     db,
		Router:       http.NewServeMux(),
		Config:       cfg,
		Logger:       logger,
		OrderService: nil, // set in setupRoutes
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

	// Services
	productSvc := service.NewProductService(productRepo)
	orderSvc := service.NewOrderService(orderRepo, couponRepo, productRepo)
	couponSvc := service.NewCouponService(couponRepo)
	profileSvc := service.NewProfileService(profileRepo)
	cartSvc := service.NewCartService(cartRepo)
	configSvc := service.NewConfigService(configRepo)

	adminUserRepo := repository.NewAdminUserRepository(a.DB)

	// Handlers
	productHandler := handlers.NewProductHandler(productSvc)
	orderHandler := handlers.NewOrderHandler(orderSvc, profileSvc, configSvc)
	couponHandler := handlers.NewCouponHandler(couponSvc)
	profileHandler := handlers.NewProfileHandler(profileSvc, configSvc)
	cartHandler := handlers.NewCartHandler(cartSvc)
	spinHandler := handlers.NewSpinHandler(profileSvc, couponSvc, configSvc)
	configHandler := handlers.NewConfigHandler(configSvc)
	staffHandler := handlers.NewStaffHandler(adminUserRepo)

	adminOnly := middleware.AdminAuthMiddleware(a.Config.SuperAdminEmail, adminUserRepo, "admin")
	adminOrEmployee := middleware.AdminAuthMiddleware(a.Config.SuperAdminEmail, adminUserRepo, "admin", "employee")

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
	a.Router.HandleFunc("/api/orders", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			orderHandler.HandleGetOrder(w, r)
		} else {
			rateLimiter.Limit(http.HandlerFunc(orderHandler.HandleCheckout)).ServeHTTP(w, r)
		}
	})
	a.Router.HandleFunc("/api/orders/create", rateLimiter.Limit(http.HandlerFunc(orderHandler.HandleCheckout)).ServeHTTP)
	a.Router.HandleFunc("/api/checkout", rateLimiter.Limit(http.HandlerFunc(orderHandler.HandleCheckout)).ServeHTTP)

	a.Router.HandleFunc("/api/orders/verify", orderHandler.HandleVerifyPayment)
	a.Router.HandleFunc("/api/verify-payment", orderHandler.HandleVerifyPayment)

	a.Router.HandleFunc("/api/profile/orders", orderHandler.HandleGetOrder)

	// Coupons & Gifting
	a.Router.HandleFunc("/api/gift-tiers", couponHandler.HandleGetGiftTiers)
	a.Router.HandleFunc("/api/coupons/validate", rateLimiter.Limit(http.HandlerFunc(couponHandler.HandleValidateCoupon)).ServeHTTP)
	
	// Spin the Wheel
	a.Router.HandleFunc("/api/spin-wheel", rateLimiter.Limit(http.HandlerFunc(spinHandler.HandleSpin)).ServeHTTP)
	
	// Admin API Endpoints
	a.Router.HandleFunc("/api/admin/orders", adminOrEmployee(http.HandlerFunc(orderHandler.HandleGetOrder)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/orders/confirm-pickup", adminOrEmployee(http.HandlerFunc(orderHandler.HandleConfirmPickup)).ServeHTTP)
	
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
	
	// Staff Identity
	a.Router.HandleFunc("/api/admin/me", adminOrEmployee(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role := r.Context().Value(middleware.RoleKey).(string)
		email := r.Context().Value(middleware.EmailKey).(string)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"email": email, "role": role})
	})).ServeHTTP)
	
	// Config API Endpoints
	a.Router.HandleFunc("/api/config/spin-wheel", configHandler.HandleGetSpinConfig)
	a.Router.HandleFunc("/api/admin/config/spin-wheel", adminOnly(http.HandlerFunc(configHandler.HandleUpdateSpinConfig)).ServeHTTP)
	a.Router.HandleFunc("/api/admin/config/spin-wheel/stats", adminOnly(http.HandlerFunc(configHandler.HandleGetSpinStats)).ServeHTTP)

	a.Router.HandleFunc("/api/config/auth", configHandler.HandleGetAuthConfig)
	a.Router.HandleFunc("/api/admin/config/auth", adminOnly(http.HandlerFunc(configHandler.HandleUpdateAuthConfig)).ServeHTTP)

	a.Router.HandleFunc("/api/config/checkout", configHandler.HandleGetCheckoutConfig)
	a.Router.HandleFunc("/api/admin/config/checkout", adminOnly(http.HandlerFunc(configHandler.HandleUpdateCheckoutConfig)).ServeHTTP)

	// User Profiles & Addresses
	a.Router.HandleFunc("/api/profile", profileHandler.HandleProfile)
	a.Router.HandleFunc("/api/profile/me", profileHandler.HandleProfile)
	a.Router.HandleFunc("/api/addresses", profileHandler.HandleAddresses)
	a.Router.HandleFunc("/api/profile/addresses", profileHandler.HandleAddresses)
	a.Router.HandleFunc("/api/profile/coupons", couponHandler.HandleUserCoupons)

	// Cart & Wishlist
	a.Router.HandleFunc("/api/cart", cartHandler.HandleCart)
	a.Router.HandleFunc("/api/cart/merge", cartHandler.HandleCart)

	a.Router.HandleFunc("/api/wishlist", cartHandler.HandleWishlist)
	a.Router.HandleFunc("/api/wishlist/merge", cartHandler.HandleWishlist)

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

	// Static file server fallback for SPA & Admin Portal
	frontendDist := "./frontend/dist"
	frontendPublic := "./frontend/public"

	fsDist := http.FileServer(http.Dir(frontendDist))
	fsPublic := http.FileServer(http.Dir(frontendPublic))

	a.Router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path

		// Direct match for /admin or /admin/
		if path == "/admin" || path == "/admin/" {
			adminFile := frontendPublic + "/admin/index.html"
			if _, err := os.Stat(frontendDist + "/admin/index.html"); err == nil {
				adminFile = frontendDist + "/admin/index.html"
			}
			http.ServeFile(w, r, adminFile)
			return
		}

		// Check if file exists in frontend/dist
		if _, err := os.Stat(frontendDist + path); err == nil && path != "/" {
			fsDist.ServeHTTP(w, r)
			return
		}

		// Check if file exists in frontend/public
		if _, err := os.Stat(frontendPublic + path); err == nil && path != "/" {
			fsPublic.ServeHTTP(w, r)
			return
		}

		// Fallback for React SPA
		if _, err := os.Stat(frontendDist + "/index.html"); err == nil {
			http.ServeFile(w, r, frontendDist+"/index.html")
		} else if _, err := os.Stat(frontendPublic + "/index.html"); err == nil {
			http.ServeFile(w, r, frontendPublic+"/index.html")
		} else {
			http.NotFound(w, r)
		}
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
	go func() {
		ticker := time.NewTicker(15 * time.Minute)
		defer ticker.Stop()
		for range ticker.C {
			if a.OrderService != nil {
				cleaned, err := a.OrderService.CleanupAbandonedOrders(30 * time.Minute)
				if err != nil {
					a.Logger.Error("Failed to cleanup abandoned orders", "error", err)
				} else if cleaned > 0 {
					a.Logger.Info("Cleaned abandoned orders", "count", cleaned)
				}
			}
		}
	}()
}

func (a *App) Shutdown(ctx context.Context) error {
	if a.HTTPServer != nil {
		return a.HTTPServer.Shutdown(ctx)
	}
	return nil
}
