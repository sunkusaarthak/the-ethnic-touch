package config

import (
	"os"
	"testing"
)

func TestLoadConfig_Defaults(t *testing.T) {
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")
	os.Unsetenv("ADMIN_API_KEY")

	cfg := LoadConfig()

	if cfg.DBHost != "localhost" {
		t.Errorf("Expected default DBHost 'localhost', got %s", cfg.DBHost)
	}

	if cfg.DBPort != "5432" {
		t.Errorf("Expected default DBPort '5432', got %s", cfg.DBPort)
	}

	if cfg.AdminAPIKey != "admin_secret_token_123" {
		t.Errorf("Expected default AdminAPIKey 'admin_secret_token_123', got %s", cfg.AdminAPIKey)
	}
}

func TestLoadConfig_CustomEnvironment(t *testing.T) {
	os.Setenv("DB_HOST", "custom-db.render.com")
	os.Setenv("DB_PORT", "5433")
	os.Setenv("ADMIN_API_KEY", "prod_admin_secret_99")
	defer func() {
		os.Unsetenv("DB_HOST")
		os.Unsetenv("DB_PORT")
		os.Unsetenv("ADMIN_API_KEY")
	}()

	cfg := LoadConfig()

	if cfg.DBHost != "custom-db.render.com" {
		t.Errorf("Expected DBHost 'custom-db.render.com', got %s", cfg.DBHost)
	}

	if cfg.DBPort != "5433" {
		t.Errorf("Expected DBPort '5433', got %s", cfg.DBPort)
	}

	if cfg.AdminAPIKey != "prod_admin_secret_99" {
		t.Errorf("Expected AdminAPIKey 'prod_admin_secret_99', got %s", cfg.AdminAPIKey)
	}
}
