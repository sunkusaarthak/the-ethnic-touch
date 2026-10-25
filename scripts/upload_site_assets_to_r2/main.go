package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/joho/godotenv"
)

func mustEnv(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Missing environment variable: %s", key)
	}
	return val
}

func main() {
	_ = godotenv.Load()

	accountID := mustEnv("CF_R2_ACCOUNT_ID")
	accessKey := mustEnv("CF_R2_ACCESS_KEY_ID")
	secretKey := mustEnv("CF_R2_SECRET_ACCESS_KEY")
	bucket := mustEnv("CF_R2_BUCKET_NAME")
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
	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(r2Endpoint)
		o.UsePathStyle = true
	})

	baseDir := filepath.Join("frontend", "public", "images")
	uploaded := 0
	failed := 0

	err = filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		rel, err := filepath.Rel(baseDir, path)
		if err != nil {
			return err
		}

		// Normalize to forward slashes: images/<rel>
		r2Key := "images/" + filepath.ToSlash(rel)

		ext := strings.ToLower(filepath.Ext(path))
		ct := "application/octet-stream"
		switch ext {
		case ".png":
			ct = "image/png"
		case ".jpg", ".jpeg":
			ct = "image/jpeg"
		case ".webp":
			ct = "image/webp"
		case ".svg":
			ct = "image/svg+xml"
		}

		data, err := os.ReadFile(path)
		if err != nil {
			log.Printf("❌ Failed to read %s: %v", path, err)
			failed++
			return nil
		}

		log.Printf("→ Uploading %s to %s (%s, %d bytes)", path, r2Key, ct, len(data))

		_, err = client.PutObject(context.Background(), &s3.PutObjectInput{
			Bucket:             aws.String(bucket),
			Key:                aws.String(r2Key),
			Body:               bytes.NewReader(data),
			ContentType:        aws.String(ct),
			CacheControl:       aws.String("public, max-age=31536000, immutable"),
			ContentDisposition: aws.String("inline"),
		})
		if err != nil {
			log.Printf("❌ PutObject failed for %s: %v", r2Key, err)
			failed++
		} else {
			uploaded++
			log.Printf("  ✅ URL: %s/%s", strings.TrimRight(publicURL, "/"), r2Key)
		}

		return nil
	})

	if err != nil {
		log.Fatalf("Walk error: %v", err)
	}

	fmt.Printf("\n════════════════════════════════\nUpload complete. Uploaded: %d  Failed: %d\n", uploaded, failed)
}
