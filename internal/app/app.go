package app

import (
	"database/sql"
	"log/slog"
	"net/http"
	"os"

	"ethnictouch/internal/config"
	"ethnictouch/internal/handlers"
	"ethnictouch/internal/middleware"
	"ethnictouch/internal/repository"
	"ethnictouch/internal/service"
)

type App struct {
	DB     *sql.DB
	Router *http.ServeMux
	Config *config.Config
	Logger *slog.Logger
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
	// Services
	productSvc := service.NewProductService(productRepo)
	// Handlers
	productHandler := handlers.NewProductHandler(productSvc)

	// API Routes (Notice using Go 1.22+ method routing)
	a.Router.HandleFunc("GET /api/products", productHandler.HandleProducts)
	a.Router.HandleFunc("POST /api/products", middleware.AdminAuthMiddleware(a.Config.AdminAPIKey)(http.HandlerFunc(productHandler.HandleProducts)).ServeHTTP)
	
	a.Router.HandleFunc("GET /api/products/{id}/reviews", productHandler.HandleProductReviews)
	a.Router.HandleFunc("POST /api/products/{id}/reviews", productHandler.HandleProductReviews)

	// Health
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

	// Add file server for frontend
	frontendDist := "./frontend/dist"
	fs := http.FileServer(http.Dir(frontendDist))
	a.Router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		if _, err := os.Stat(frontendDist + path); os.IsNotExist(err) && path != "/" {
			http.ServeFile(w, r, frontendDist+"/index.html")
			return
		}
		fs.ServeHTTP(w, r)
	})
}

func (a *App) Run(port string) error {
	a.Logger.Info("Starting server", slog.String("port", port))
	
	// Apply global middleware (CORS -> Logging -> Router)
	handler := middleware.LoggingMiddleware(a.Logger)(middleware.CORSMiddleware(a.Router))
	
	return http.ListenAndServe(":"+port, handler)
}
