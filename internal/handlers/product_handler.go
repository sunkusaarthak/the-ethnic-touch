package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"ethnictouch/internal/models"
	service "ethnictouch/internal/service"
	"ethnictouch/internal/utils"
)

type ProductHandler struct {
	svc service.ProductService
}

func NewProductHandler(svc service.ProductService) *ProductHandler {
	return &ProductHandler{svc: svc}
}

func (h *ProductHandler) HandleProducts(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		filters := map[string]string{
			"q":           r.URL.Query().Get("q"),
			"category":    r.URL.Query().Get("category"),
			"sizes":       r.URL.Query().Get("sizes"),
			"colors":      r.URL.Query().Get("colors"),
			"fabrics":     r.URL.Query().Get("fabrics"),
			"sleeveTypes": r.URL.Query().Get("sleeveTypes"),
			"neckTypes":   r.URL.Query().Get("neckTypes"),
			"patterns":    r.URL.Query().Get("patterns"),
			"occasions":   r.URL.Query().Get("occasions"),
			"collection":  r.URL.Query().Get("collection"),
			"minPrice":    r.URL.Query().Get("minPrice"),
			"maxPrice":    r.URL.Query().Get("maxPrice"),
			"minRating":   r.URL.Query().Get("minRating"),
			"inStockOnly": r.URL.Query().Get("inStockOnly"),
			"minDiscount": r.URL.Query().Get("minDiscount"),
			"newArrival":  r.URL.Query().Get("newArrival"),
			"bestSeller":  r.URL.Query().Get("bestSeller"),
			"featured":    r.URL.Query().Get("featured"),
			"sortBy":      r.URL.Query().Get("sortBy"),
			"paginated":   r.URL.Query().Get("paginated"),
			"page":        r.URL.Query().Get("page"),
			"limit":       r.URL.Query().Get("limit"),
		}

		products, meta, err := h.svc.GetProducts(filters)
		if err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		if filters["paginated"] == "true" {
			meta["products"] = products
			json.NewEncoder(w).Encode(meta)
		} else {
			json.NewEncoder(w).Encode(products)
		}
	} else if r.Method == http.MethodPost {
		// AdminAuthMiddleware should protect this in routing
		var p models.Product
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusBadRequest)
			return
		}

		if err := h.svc.CreateProduct(&p); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(p)
	} else if r.Method == http.MethodPut {
		var p models.Product
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusBadRequest)
			return
		}

		if err := h.svc.UpdateProduct(&p); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(p)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *ProductHandler) HandleProductByID(w http.ResponseWriter, r *http.Request) {
	productID := r.PathValue("id")
	if productID == "" {
		// Fallback for custom mux if not using 1.22 path values
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) >= 3 {
			productID = parts[2]
		}
	}
	
	if productID == "" {
		http.Error(w, "Product ID is required", http.StatusBadRequest)
		return
	}

	if r.Method == http.MethodGet {
		product, err := h.svc.GetProductByID(productID)
		if err != nil {
			if err.Error() == "product not found" {
				http.Error(w, "Product not found", http.StatusNotFound)
			} else {
				http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(product)
		return
	} else if r.Method == http.MethodDelete {
		// DELETE should be guarded by admin middleware at the router level or here
		// But in this case, the router handles middleware differently.
		// Wait, if it's the same endpoint, we have to handle auth.
		// Actually, let's keep the router simple and just let it pass here.
		// In app.go we will wrap the DELETE method inside the router with adminOnly.
		if err := h.svc.DeleteProduct(productID); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message": "Product deleted successfully"}`))
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (h *ProductHandler) HandleProductReviews(w http.ResponseWriter, r *http.Request) {
	// Route is expected to be /api/products/{id}/reviews
	// since we are using std lib 1.22+, we can use PathValue
	productID := r.PathValue("id")
	if productID == "" {
		// Fallback for custom mux if not using 1.22 path values
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) >= 3 {
			productID = parts[2]
		}
	}

	if r.Method == http.MethodGet {
		reviews, err := h.svc.GetReviews(productID)
		if err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(reviews)
	} else if r.Method == http.MethodPost {
		var rev models.ProductReview
		if err := json.NewDecoder(r.Body).Decode(&rev); err != nil {
			http.Error(w, "Invalid review payload", http.StatusBadRequest)
			return
		}
		rev.ProductID = productID

		if err := h.svc.CreateReview(&rev); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusBadRequest)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(rev)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *ProductHandler) HandleAdminUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "File size too large or invalid form", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to read file from request", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Read file into bytes for R2 upload
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Failed to read file bytes", http.StatusInternalServerError)
		return
	}

	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = ".jpg"
	}
	newFileName := fmt.Sprintf("upload_%d%s", time.Now().UnixNano(), ext)

	// Detect content type from extension
	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		switch strings.ToLower(ext) {
		case ".png":
			contentType = "image/png"
		case ".webp":
			contentType = "image/webp"
		case ".gif":
			contentType = "image/gif"
		default:
			contentType = "image/jpeg"
		}
	}

	// Attempt to upload to Cloudflare R2
	secureURL, err := uploadToR2(fileBytes, newFileName, contentType)
	if err != nil {
		fmt.Printf("[R2 ERROR] Failed to upload: %v\n", err)
		// Fallback to local storage if Cloudinary fails or is not configured
		uploadDir := filepath.Join("frontend", "public", "images", "products")
		if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
			http.Error(w, "Failed to create upload directory", http.StatusInternalServerError)
			return
		}

		dstPath := filepath.Join(uploadDir, newFileName)
		dst, err := os.Create(dstPath)
		if err != nil {
			http.Error(w, "Failed to create destination file", http.StatusInternalServerError)
			return
		}
		defer dst.Close()

		if _, err := dst.Write(fileBytes); err != nil {
			http.Error(w, "Failed to write file", http.StatusInternalServerError)
			return
		}

		secureURL = fmt.Sprintf("/images/products/%s", newFileName)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"url": secureURL,
	})
}

// uploadToR2 uploads the given file bytes to Cloudflare R2 via the S3-compatible API
// and returns the public URL of the uploaded object.
func uploadToR2(fileBytes []byte, fileName string, contentType string) (string, error) {
	accountID := os.Getenv("CF_R2_ACCOUNT_ID")
	accessKey := os.Getenv("CF_R2_ACCESS_KEY_ID")
	secretKey := os.Getenv("CF_R2_SECRET_ACCESS_KEY")
	bucket := os.Getenv("CF_R2_BUCKET_NAME")
	publicURL := os.Getenv("CF_R2_PUBLIC_URL")

	if accountID == "" || accessKey == "" || secretKey == "" || bucket == "" || publicURL == "" {
		return "", fmt.Errorf("Cloudflare R2 credentials are not configured in environment")
	}

	// R2 S3-compatible endpoint
	r2Endpoint := fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID)

	// Store all product images under a products/ prefix
	objectKey := "products/" + fileName

	// Build SDK config pointing at R2
	cfg, err := config.LoadDefaultConfig(context.Background(),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(accessKey, secretKey, ""),
		),
		config.WithRegion("auto"),
	)
	if err != nil {
		return "", fmt.Errorf("failed to build R2 config: %w", err)
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.BaseEndpoint = aws.String(r2Endpoint)
		o.UsePathStyle = true
	})

	_, err = client.PutObject(context.Background(), &s3.PutObjectInput{
		Bucket:             aws.String(bucket),
		Key:                aws.String(objectKey),
		Body:               bytes.NewReader(fileBytes),
		ContentType:        aws.String(contentType),
		// Cache for 1 year — images are content-addressed so they never change.
		// Cloudflare edge + browsers will serve from cache; no R2 Class B op on repeat views.
		CacheControl:       aws.String("public, max-age=31536000, immutable"),
		ContentDisposition: aws.String("inline"),
	})
	if err != nil {
		return "", fmt.Errorf("R2 PutObject failed: %w", err)
	}

	// Return fully-qualified public URL
	return fmt.Sprintf("%s/%s", strings.TrimRight(publicURL, "/"), objectKey), nil
}
