package handlers

import (
	"encoding/json"
	"net/http"

	"ethnictouch/internal/service"
)

type CartHandler struct {
	svc service.CartService
}

func NewCartHandler(svc service.CartService) *CartHandler {
	return &CartHandler{svc: svc}
}

func (h *CartHandler) HandleCart(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		userID = r.URL.Query().Get("userId")
	}

	if userID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error":"Missing user identification header"}`))
		return
	}

	if r.Method == http.MethodGet {
		items, err := h.svc.GetCart(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(items)
	} else if r.Method == http.MethodPost {
		r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
		var req struct {
			ProductID string `json:"productId"`
			Quantity  int    `json:"quantity"`
			Size      string `json:"size"`
			Items     []struct {
				ProductID string `json:"productId"`
				Quantity  int    `json:"quantity"`
				Size      string `json:"size"`
			} `json:"items"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		if len(req.Items) > 0 {
			for _, item := range req.Items {
				h.svc.AddToCart(userID, item.ProductID, item.Quantity, item.Size)
			}
		} else if req.ProductID != "" {
			if err := h.svc.AddToCart(userID, req.ProductID, req.Quantity, req.Size); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Cart updated"})
	} else if r.Method == http.MethodDelete {
		if r.URL.Query().Get("clearAll") == "true" {
			h.svc.ClearCart(userID)
		} else {
			productID := r.URL.Query().Get("productId")
			size := r.URL.Query().Get("size")
			h.svc.RemoveFromCart(userID, productID, size)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Cart updated"})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *CartHandler) HandleWishlist(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		userID = r.URL.Query().Get("userId")
	}

	if userID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error":"Missing user identification header"}`))
		return
	}

	if r.Method == http.MethodGet {
		products, err := h.svc.GetWishlist(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(products)
	} else if r.Method == http.MethodPost {
		var req struct {
			ProductID  string   `json:"productId"`
			ProductIDs []string `json:"productIds"`
		}
		json.NewDecoder(r.Body).Decode(&req)

		if len(req.ProductIDs) > 0 {
			h.svc.MergeWishlist(userID, req.ProductIDs)
		} else if req.ProductID != "" {
			h.svc.AddToWishlist(userID, req.ProductID)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Wishlist updated"})
	} else if r.Method == http.MethodDelete {
		productID := r.URL.Query().Get("productId")
		h.svc.RemoveFromWishlist(userID, productID)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Item removed from wishlist"})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
