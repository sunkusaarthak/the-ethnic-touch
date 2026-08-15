package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"ethnictouch/internal/app"
	"ethnictouch/internal/config"
)

func main() {
	// Initialize structured JSON logger
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

	// Listen for interrupt / termination signals for graceful shutdown
	stopChannel := make(chan os.Signal, 1)
	signal.Notify(stopChannel, os.Interrupt, syscall.SIGTERM)

	application.StartBackgroundJobs()

	go func() {
		if err := application.Run(port); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("Server crashed", "error", err)
			os.Exit(1)
		}
	}()

	logger.Info("Server listening for incoming connections", slog.String("port", port))
	<-stopChannel

	logger.Info("Shutting down server gracefully...")
	_, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	logger.Info("Server shutdown complete.")
}
