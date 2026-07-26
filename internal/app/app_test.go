package app

import (
	"context"
	"ethnictouch/internal/config"
	"log/slog"
	"os"
	"testing"
	"time"
)

func TestApp_InitializationAndShutdown(t *testing.T) {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	cfg := &config.Config{
		DBHost:      "localhost",
		DBPort:      "5432",
		AdminAPIKey: "test_key",
	}

	appInstance := &App{
		Router: nil,
		Config: cfg,
		Logger: logger,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	err := appInstance.Shutdown(ctx)
	if err != nil {
		t.Errorf("Expected nil error on shutdown when HTTPServer is nil, got: %v", err)
	}
}
