package handlers

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
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
			http.Error(w, err.Error(), http.StatusInternalServerError)
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
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if err := h.svc.CreateProduct(&p); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(p)
	} else if r.Method == http.MethodPut {
		var p models.Product
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		if err := h.svc.UpdateProduct(&p); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
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
				http.Error(w, err.Error(), http.StatusInternalServerError)
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
			http.Error(w, err.Error(), http.StatusInternalServerError)
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
			http.Error(w, err.Error(), http.StatusInternalServerError)
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
			http.Error(w, err.Error(), http.StatusBadRequest)
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

	// Read file into bytes for Cloudinary upload
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

	// Attempt to upload to Cloudinary first
	secureURL, err := uploadToCloudinary(fileBytes, newFileName)
	if err != nil {
		fmt.Printf("[CLOUDINARY ERROR] Failed to upload: %v\n", err)
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

func uploadToCloudinary(fileBytes []byte, fileName string) (string, error) {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return "", fmt.Errorf("Cloudinary credentials are not configured in system environment")
	}

	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	
	// Create signature
	sigStr := fmt.Sprintf("timestamp=%s%s", timestamp, apiSecret)
	hasher := sha1.New()
	hasher.Write([]byte(sigStr))
	signature := hex.EncodeToString(hasher.Sum(nil))

	// Create multipart body
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// File field
	part, err := writer.CreateFormFile("file", fileName)
	if err != nil {
		return "", err
	}
	if _, err := part.Write(fileBytes); err != nil {
		return "", err
	}

	// Other fields
	writer.WriteField("api_key", apiKey)
	writer.WriteField("timestamp", timestamp)
	writer.WriteField("signature", signature)

	err = writer.Close()
	if err != nil {
		return "", err
	}

	// HTTP request
	url := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", cloudName)
	req, err := http.NewRequest("POST", url, body)
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Cloudinary upload failed with status %d: %s", resp.StatusCode, string(respBytes))
	}

	// Parse response
	var result struct {
		SecureURL string `json:"secure_url"`
		URL       string `json:"url"`
	}
	if err := json.Unmarshal(respBytes, &result); err != nil {
		return "", err
	}

	if result.SecureURL != "" {
		return result.SecureURL, nil
	}
	return result.URL, nil
}
