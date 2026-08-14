package app

import (
	"context"
	"database/sql"
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
	Config     *config.Config
	Logger     *slog.Logger
	HTTPServer *http.Server
}

func NewApp(cfg *config.Config, logger *slog.Logger) (*App, error) {
	db, err := repository.InitDB(cfg)
	if err != nil {
		return nil, err
	}

	app := &App{
		DB:     db,
		Router: http.NewServeMux(),
		Config: cfg,
		Logger: logger,
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

	// Handlers
	productHandler := handlers.NewProductHandler(productSvc)
	orderHandler := handlers.NewOrderHandler(orderSvc, profileSvc, configSvc)
	couponHandler := handlers.NewCouponHandler(couponSvc)
	profileHandler := handlers.NewProfileHandler(profileSvc, configSvc)
	cartHandler := handlers.NewCartHandler(cartSvc)
	spinHandler := handlers.NewSpinHandler(profileSvc, couponSvc, configSvc)
	configHandler := handlers.NewConfigHandler(configSvc)

	// API Routes (Go 1.22+ stdlib routing)
	a.Router.HandleFunc("GET /api/products", productHandler.HandleProducts)
	a.Router.HandleFunc("POST /api/products", middleware.AdminAuthMiddleware(a.Config.AdminAPIKey)(http.HandlerFunc(productHandler.HandleProducts)).ServeHTTP)
	a.Router.HandleFunc("PUT /api/products", middleware.AdminAuthMiddleware(a.Config.AdminAPIKey)(http.HandlerFunc(productHandler.HandleProducts)).ServeHTTP)
	a.Router.HandleFunc("DELETE /api/products/{id}", middleware.AdminAuthMiddleware(a.Config.AdminAPIKey)(http.HandlerFunc(productHandler.HandleDeleteProduct)).ServeHTTP)

	a.Router.HandleFunc("GET /api/products/{id}/reviews", productHandler.HandleProductReviews)
	a.Router.HandleFunc("POST /api/products/{id}/reviews", productHandler.HandleProductReviews)

	rateLimiter := middleware.NewRateLimiter(30, time.Minute)

	// Orders & Checkout
	a.Router.HandleFunc("POST /api/orders", rateLimiter.Limit(http.HandlerFunc(orderHandler.HandleCheckout)).ServeHTTP)
	a.Router.HandleFunc("POST /api/orders/create", rateLimiter.Limit(http.HandlerFunc(orderHandler.HandleCheckout)).ServeHTTP)
	a.Router.HandleFunc("POST /api/checkout", rateLimiter.Limit(http.HandlerFunc(orderHandler.HandleCheckout)).ServeHTTP)

	a.Router.HandleFunc("POST /api/orders/verify", orderHandler.HandleVerifyPayment)
	a.Router.HandleFunc("POST /api/verify-payment", orderHandler.HandleVerifyPayment)

	a.Router.HandleFunc("GET /api/orders", orderHandler.HandleGetOrder)
	a.Router.HandleFunc("GET /api/profile/orders", orderHandler.HandleGetOrder)

	// Coupons & Gifting
	a.Router.HandleFunc("GET /api/gift-tiers", couponHandler.HandleGetGiftTiers)
	a.Router.HandleFunc("POST /api/coupons/validate", rateLimiter.Limit(http.HandlerFunc(couponHandler.HandleValidateCoupon)).ServeHTTP)
	
	// Spin the Wheel
	a.Router.HandleFunc("POST /api/spin-wheel", rateLimiter.Limit(http.HandlerFunc(spinHandler.HandleSpin)).ServeHTTP)
	
	// Admin API Endpoints
	adminAuth := middleware.AdminAuthMiddleware(a.Config.AdminAPIKey)
	a.Router.HandleFunc("GET /api/admin/orders", adminAuth(http.HandlerFunc(orderHandler.HandleGetOrder)).ServeHTTP)
	a.Router.HandleFunc("POST /api/admin/orders/confirm-pickup", adminAuth(http.HandlerFunc(orderHandler.HandleConfirmPickup)).ServeHTTP)
	a.Router.HandleFunc("GET /api/admin/profiles", adminAuth(http.HandlerFunc(profileHandler.HandleAdminProfiles)).ServeHTTP)
	a.Router.HandleFunc("POST /api/admin/profiles/edit", adminAuth(http.HandlerFunc(profileHandler.HandleAdminProfileEdit)).ServeHTTP)
	a.Router.HandleFunc("GET /api/admin/profiles/details", adminAuth(http.HandlerFunc(profileHandler.HandleAdminProfileDetails)).ServeHTTP)
	a.Router.HandleFunc("POST /api/admin/upload", adminAuth(http.HandlerFunc(productHandler.HandleAdminUpload)).ServeHTTP)
	a.Router.HandleFunc("GET /api/admin/coupons", adminAuth(http.HandlerFunc(couponHandler.HandleAdminCoupons)).ServeHTTP)
	a.Router.HandleFunc("POST /api/admin/coupons", adminAuth(http.HandlerFunc(couponHandler.HandleAdminCoupons)).ServeHTTP)
	
	// Config API Endpoints
	a.Router.HandleFunc("GET /api/config/spin-wheel", configHandler.HandleGetSpinConfig)
	a.Router.HandleFunc("PUT /api/admin/config/spin-wheel", adminAuth(http.HandlerFunc(configHandler.HandleUpdateSpinConfig)).ServeHTTP)
	a.Router.HandleFunc("GET /api/admin/config/spin-wheel/stats", adminAuth(http.HandlerFunc(configHandler.HandleGetSpinStats)).ServeHTTP)

	a.Router.HandleFunc("GET /api/config/auth", configHandler.HandleGetAuthConfig)
	a.Router.HandleFunc("PUT /api/admin/config/auth", adminAuth(http.HandlerFunc(configHandler.HandleUpdateAuthConfig)).ServeHTTP)

	// User Profiles & Addresses
	a.Router.HandleFunc("GET /api/profile", profileHandler.HandleProfile)
	a.Router.HandleFunc("POST /api/profile", profileHandler.HandleProfile)
	a.Router.HandleFunc("GET /api/profile/me", profileHandler.HandleProfile)
	a.Router.HandleFunc("POST /api/profile/me", profileHandler.HandleProfile)
	a.Router.HandleFunc("PUT /api/profile/me", profileHandler.HandleProfile)
	a.Router.HandleFunc("PATCH /api/profile/me", profileHandler.HandleProfile)

	a.Router.HandleFunc("GET /api/addresses", profileHandler.HandleAddresses)
	a.Router.HandleFunc("POST /api/addresses", profileHandler.HandleAddresses)
	a.Router.HandleFunc("GET /api/profile/addresses", profileHandler.HandleAddresses)
	a.Router.HandleFunc("POST /api/profile/addresses", profileHandler.HandleAddresses)
	a.Router.HandleFunc("PATCH /api/profile/addresses", profileHandler.HandleAddresses)
	a.Router.HandleFunc("DELETE /api/profile/addresses", profileHandler.HandleAddresses)

	a.Router.HandleFunc("GET /api/profile/coupons", couponHandler.HandleUserCoupons)

	// Cart & Wishlist
	a.Router.HandleFunc("GET /api/cart", cartHandler.HandleCart)
	a.Router.HandleFunc("POST /api/cart", cartHandler.HandleCart)
	a.Router.HandleFunc("DELETE /api/cart", cartHandler.HandleCart)
	a.Router.HandleFunc("POST /api/cart/merge", cartHandler.HandleCart)

	a.Router.HandleFunc("GET /api/wishlist", cartHandler.HandleWishlist)
	a.Router.HandleFunc("POST /api/wishlist", cartHandler.HandleWishlist)
	a.Router.HandleFunc("DELETE /api/wishlist", cartHandler.HandleWishlist)
	a.Router.HandleFunc("POST /api/wishlist/merge", cartHandler.HandleWishlist)

	// Health check endpoint
	a.Router.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
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

func (a *App) Shutdown(ctx context.Context) error {
	if a.HTTPServer != nil {
		return a.HTTPServer.Shutdown(ctx)
	}
	return nil
}
