package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	accountID := os.Getenv("CF_R2_ACCOUNT_ID")
	accessKey := os.Getenv("CF_R2_ACCESS_KEY_ID")
	secretKey := os.Getenv("CF_R2_SECRET_ACCESS_KEY")
	bucket := os.Getenv("CF_R2_BUCKET_NAME")
	publicURL := os.Getenv("CF_R2_PUBLIC_URL")

	if accountID == "" || accessKey == "" || secretKey == "" || bucket == "" || publicURL == "" {
		log.Fatal("Missing R2 environment variables")
	}

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

	files := []string{
		"frontend/public/email-assets/check_circle_green.png",
		"frontend/public/email-assets/pending_clock_amber.png",
		"frontend/public/email-assets/product_placeholder.png",
	}

	for _, f := range files {
		data, err := os.ReadFile(f)
		if err != nil {
			log.Fatalf("Failed to read %s: %v", f, err)
		}

		key := "email-assets/" + filepath.Base(f)
		_, err = client.PutObject(context.Background(), &s3.PutObjectInput{
			Bucket:             aws.String(bucket),
			Key:                aws.String(key),
			Body:               bytes.NewReader(data),
			ContentType:        aws.String("image/png"),
			CacheControl:       aws.String("public, max-age=31536000, immutable"),
			ContentDisposition: aws.String("inline"),
		})
		if err != nil {
			log.Fatalf("Failed to upload %s: %v", key, err)
		}
		fmt.Printf("✅ Uploaded: %s/%s\n", publicURL, key)
	}
}
