package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	"ethnictouch/internal/config"
	"ethnictouch/internal/models"
	_ "github.com/lib/pq"
)

func main() {
	cfg := config.LoadConfig()
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("failed: %v", err)
	}
	defer db.Close()

	var val string
	err = db.QueryRow("SELECT value FROM system_config WHERE key = 'homepage_config'").Scan(&val)
	if err != nil {
		log.Fatalf("failed: %v", err)
	}

	var hp models.HomepageConfig
	if err := json.Unmarshal([]byte(val), &hp); err != nil {
		log.Fatalf("failed unmarshal: %v", err)
	}

	for _, r := range hp.Instagram.Reels {
		fmt.Printf("ID: %s | ReelCode: '%s' | URL: '%s' | Thumb: '%s'\n", r.ID, r.ReelCode, r.InstagramURL, r.Thumbnail)
	}
}
