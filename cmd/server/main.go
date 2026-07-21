package main

import (
	"log/slog"
	"os"

	"ethnictouch/internal/app"
	"ethnictouch/internal/config"
)

func main() {
	// Initialize structured logger
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	cfg := config.LoadConfig()

	logger.Info("Initializing Application Server...")

	application, err := app.NewApp(cfg, logger)
	if err != nil {
		logger.Error("Failed to initialize application", "error", err)
		os.Exit(1)
	}

	defer application.DB.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := application.Run(port); err != nil {
		logger.Error("Server crashed", "error", err)
		os.Exit(1)
	}
}
