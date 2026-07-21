package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

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
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
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
