// scripts/migrate_images/main.go
//
// Uploads local product images to Cloudflare R2 and updates PostgreSQL.
//
// Filename convention: "Product Name - N.ext"  (N=1 is primary image)
//
// Usage:
//   go run ./scripts/migrate_images/main.go <path-to-images-folder>
//
// Required env vars:
//   CF_R2_ACCOUNT_ID, CF_R2_ACCESS_KEY_ID, CF_R2_SECRET_ACCESS_KEY
//   CF_R2_BUCKET_NAME, CF_R2_PUBLIC_URL
//   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSLMODE

package main

import (
	"bytes"
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// imageFile represents a parsed local image file
type imageFile struct {
	Path        string
	ProductName string
	Priority    int
	Ext         string
}

func main() {
	_ = godotenv.Load()

	if len(os.Args) < 2 {
		log.Fatal("Usage: go run ./scripts/migrate_images/main.go <path-to-images-folder>")
	}
	folder := os.Args[1]

	// ── R2 client ─────────────────────────────────────────────────────────────
	accountID := mustEnv("CF_R2_ACCOUNT_ID")
	accessKey := mustEnv("CF_R2_ACCESS_KEY_ID")
	secretKey := mustEnv("CF_R2_SECRET_ACCESS_KEY")
	bucket    := mustEnv("CF_R2_BUCKET_NAME")
	publicURL := mustEnv("CF_R2_PUBLIC_URL")

	r2Endpoint := fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID)

	cfg, err := config.LoadDefaultConfig(context.Background(),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(accessKey, secretKey, ""),
		),
		config.WithRegion("auto"),
	)
	if err != nil {
		log.Fatalf("R2 config error: %v", err)
	}
	r2 := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(r2Endpoint)
		o.UsePathStyle  = true
	})
	log.Println("✅ R2 client ready")

	// ── Database ─────────────────────────────────────────────────────────────
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"), os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"), os.Getenv("DB_SSLMODE"),
	)
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("DB open error: %v", err)
	}
	defer db.Close()
	if err := db.Ping(); err != nil {
		log.Fatalf("DB ping error: %v", err)
	}
	log.Println("✅ Connected to database")

	// ── Parse image files ─────────────────────────────────────────────────────
	// Regex handles "Product Name - 1.PNG" and "Product Name -1.PNG" (no space)
	re := regexp.MustCompile(`(?i)^(.+?)\s*-\s*(\d+)\.(png|jpg|jpeg|webp)$`)

	entries, err := os.ReadDir(folder)
	if err != nil {
		log.Fatalf("Cannot read folder: %v", err)
	}

	// Group by product name (lowercased for matching)
	grouped := map[string][]imageFile{}
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		m := re.FindStringSubmatch(e.Name())
		if m == nil {
			log.Printf("⚠️  Skipping (unrecognised name): %s", e.Name())
			continue
		}
		productName := strings.TrimSpace(m[1])
		priority, _  := strconv.Atoi(m[2])
		ext          := strings.ToLower(m[3])

		key := strings.ToLower(productName)
		grouped[key] = append(grouped[key], imageFile{
			Path:        filepath.Join(folder, e.Name()),
			ProductName: productName,
			Priority:    priority,
			Ext:         ext,
		})
	}

	log.Printf("Found %d distinct product(s) in folder\n", len(grouped))

	// ── Process each product ──────────────────────────────────────────────────
	migrated, failed := 0, 0

	for key, imgs := range grouped {
		// Sort by priority (1 first)
		sort.Slice(imgs, func(i, j int) bool {
			return imgs[i].Priority < imgs[j].Priority
		})

		productName := imgs[0].ProductName
		log.Printf("\n→ Product: %q (%d image(s))", productName, len(imgs))

		// Find matching product in DB (case-insensitive)
		var productID string
		err := db.QueryRowContext(context.Background(),
			`SELECT id FROM products WHERE LOWER(name) = $1`, key,
		).Scan(&productID)
		if err == sql.ErrNoRows {
			log.Printf("  ⚠️  No DB match for %q — skipping", productName)
			failed++
			continue
		}
		if err != nil {
			log.Printf("  ❌ DB query error: %v", err)
			failed++
			continue
		}
		log.Printf("  DB match: %s", productID)

		// Upload each image and collect R2 URLs
		var r2URLs []string
		allOK := true
		for _, img := range imgs {
			fileBytes, err := os.ReadFile(img.Path)
			if err != nil {
				log.Printf("  ❌ Cannot read %s: %v", img.Path, err)
				allOK = false
				break
			}

			// Build a clean object key
			safeProductName := regexp.MustCompile(`[^a-zA-Z0-9_\-]`).ReplaceAllString(
				strings.ReplaceAll(productName, " ", "_"), "",
			)
			objectKey := fmt.Sprintf("products/%s_%d.%s", safeProductName, img.Priority, img.Ext)

			ct := extToContentType(img.Ext)
			_, err = r2.PutObject(context.Background(), &s3.PutObjectInput{
				Bucket:      aws.String(bucket),
				Key:         aws.String(objectKey),
				Body:        bytes.NewReader(fileBytes),
				ContentType: aws.String(ct),
			})
			if err != nil {
				log.Printf("  ❌ R2 upload failed for %s: %v", img.Path, err)
				allOK = false
				break
			}

			r2URL := fmt.Sprintf("%s/%s", strings.TrimRight(publicURL, "/"), objectKey)
			r2URLs = append(r2URLs, r2URL)
			log.Printf("  ✅ Uploaded priority %d → %s", img.Priority, r2URL)
		}

		if !allOK || len(r2URLs) == 0 {
			failed++
			continue
		}

		// Update products.image_url with the priority-1 image
		_, err = db.ExecContext(context.Background(),
			`UPDATE products SET image_url = $1 WHERE id = $2`, r2URLs[0], productID)
		if err != nil {
			log.Printf("  ❌ Failed to update image_url: %v", err)
			failed++
			continue
		}

		// Replace all gallery images: delete old rows then insert new ones
		_, err = db.ExecContext(context.Background(),
			`DELETE FROM product_images WHERE product_id = $1`, productID)
		if err != nil {
			log.Printf("  ❌ Failed to clear old gallery images: %v", err)
			failed++
			continue
		}

		for idx, url := range r2URLs {
			// priority-1 image is already in products.image_url; all go in gallery too
			// so the full gallery (including main) is available for carousels
			_ = idx
			_, err = db.ExecContext(context.Background(),
				`INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`, productID, url)
			if err != nil {
				log.Printf("  ⚠️  Could not insert gallery image %s: %v", url, err)
			}
		}

		log.Printf("  ✅ DB updated — main: %s | gallery: %d image(s)", r2URLs[0], len(r2URLs))
		migrated++
	}

	fmt.Printf("\n════════════════════════════════\n")
	fmt.Printf("Done.  Migrated: %d  Failed/Skipped: %d\n", migrated, failed)
}

func extToContentType(ext string) string {
	switch ext {
	case "png":
		return "image/png"
	case "webp":
		return "image/webp"
	case "jpeg":
		return "image/jpeg"
	default:
		return "image/jpeg"
	}
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("Missing required env var: %s", key)
	}
	return v
}
