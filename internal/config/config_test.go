package config

import (
	"os"
	"testing"
)

func TestLoadConfig_Defaults(t *testing.T) {
	os.Unsetenv("DB_HOST")
	os.Unsetenv("DB_PORT")
	os.Unsetenv("SUPER_ADMIN_EMAIL")

	cfg := LoadConfig()

	if cfg.DBHost != "localhost" {
		t.Errorf("Expected default DBHost 'localhost', got %s", cfg.DBHost)
	}

	if cfg.DBPort != "5432" {
		t.Errorf("Expected default DBPort '5432', got %s", cfg.DBPort)
	}

	if cfg.SuperAdminEmail != "admin@ethnictouch.com" {
		t.Errorf("Expected default SuperAdminEmail 'admin@ethnictouch.com', got %s", cfg.SuperAdminEmail)
	}
}

func TestLoadConfig_CustomEnvironment(t *testing.T) {
	os.Setenv("DB_HOST", "custom-db.render.com")
	os.Setenv("DB_PORT", "5433")
	os.Setenv("SUPER_ADMIN_EMAIL", "test@ethnictouch.com")
	defer func() {
		os.Unsetenv("DB_HOST")
		os.Unsetenv("DB_PORT")
		os.Unsetenv("SUPER_ADMIN_EMAIL")
	}()

	cfg := LoadConfig()

	if cfg.DBHost != "custom-db.render.com" {
		t.Errorf("Expected DBHost 'custom-db.render.com', got %s", cfg.DBHost)
	}

	if cfg.DBPort != "5433" {
		t.Errorf("Expected DBPort '5433', got %s", cfg.DBPort)
	}

	if cfg.SuperAdminEmail != "test@ethnictouch.com" {
		t.Errorf("Expected SuperAdminEmail 'test@ethnictouch.com', got %s", cfg.SuperAdminEmail)
	}
}
