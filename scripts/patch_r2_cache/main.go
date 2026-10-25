// scripts/patch_r2_cache/main.go
//
// One-time script: patches all existing R2 objects under the products/ prefix
// to have Cache-Control: public, max-age=31536000, immutable
//
// R2 (like S3) requires a copy-to-self to update object metadata in-place.
//
// Usage:
//   go run ./scripts/patch_r2_cache/main.go

package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	accountID := mustEnv("CF_R2_ACCOUNT_ID")
	accessKey := mustEnv("CF_R2_ACCESS_KEY_ID")
	secretKey := mustEnv("CF_R2_SECRET_ACCESS_KEY")
	bucket    := mustEnv("CF_R2_BUCKET_NAME")

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
		o.UsePathStyle  = true
	})

	// List all objects under products/ prefix
	log.Println("Listing objects in bucket...")
	paginator := s3.NewListObjectsV2Paginator(client, &s3.ListObjectsV2Input{
		Bucket: aws.String(bucket),
		Prefix: aws.String("products/"),
	})

	patched, failed := 0, 0

	for paginator.HasMorePages() {
		page, err := paginator.NextPage(context.Background())
		if err != nil {
			log.Fatalf("List error: %v", err)
		}

		for _, obj := range page.Contents {
			key := aws.ToString(obj.Key)
			log.Printf("→ Patching: %s", key)

			// Determine content type from extension
			ct := "image/jpeg"
			lower := strings.ToLower(key)
			switch {
			case strings.HasSuffix(lower, ".png"):
				ct = "image/png"
			case strings.HasSuffix(lower, ".webp"):
				ct = "image/webp"
			}

			// Copy object to itself with new metadata (only way to update metadata in R2/S3)
			copySource := fmt.Sprintf("%s/%s", bucket, key)
			_, err := client.CopyObject(context.Background(), &s3.CopyObjectInput{
				Bucket:             aws.String(bucket),
				Key:                aws.String(key),
				CopySource:         aws.String(copySource),
				ContentType:        aws.String(ct),
				CacheControl:       aws.String("public, max-age=31536000, immutable"),
				ContentDisposition: aws.String("inline"),
				// REPLACE tells R2 to use the new metadata instead of copying the old one
				MetadataDirective:  types.MetadataDirectiveReplace,
			})
			if err != nil {
				log.Printf("  ❌ Failed: %v", err)
				failed++
				continue
			}
			log.Printf("  ✅ Patched with 1-year cache")
			patched++
		}
	}

	fmt.Printf("\n════════════════════════════════\n")
	fmt.Printf("Done. Patched: %d  Failed: %d\n", patched, failed)
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("Missing required env var: %s", key)
	}
	return v
}
