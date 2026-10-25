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
		log.Fatalf("failed to connect: %v", err)
	}
	defer db.Close()

	var val string
	err = db.QueryRow("SELECT value FROM system_config WHERE key = 'homepage_config'").Scan(&val)
	if err != nil {
		log.Fatalf("failed to query homepage_config: %v", err)
	}

	var hp models.HomepageConfig
	if err := json.Unmarshal([]byte(val), &hp); err != nil {
		log.Fatalf("failed to unmarshal: %v", err)
	}

	// Update reel thumbnails to the downloaded real Instagram thumbnails
	thumbMap := map[string]string{
		"reel-hit": "/images/reels/reel-hit.jpg",
		"reel-2":   "/images/reels/reel-2.jpg",
		"reel-3":   "/images/reels/reel-3.jpg",
		"reel-4":   "/images/reels/reel-4.jpg",
	}

	for i := range hp.Instagram.Reels {
		id := hp.Instagram.Reels[i].ID
		if t, ok := thumbMap[id]; ok {
			hp.Instagram.Reels[i].Thumbnail = t
			fmt.Printf("Updated %s thumbnail to %s\n", id, t)
		}
	}

	updatedBytes, err := json.Marshal(hp)
	if err != nil {
		log.Fatalf("failed to marshal: %v", err)
	}

	_, err = db.Exec("UPDATE system_config SET value = $1 WHERE key = 'homepage_config'", string(updatedBytes))
	if err != nil {
		log.Fatalf("failed to update: %v", err)
	}

	fmt.Println("Successfully updated homepage_config in DB with real Instagram thumbnails!")
}
