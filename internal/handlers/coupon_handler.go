package handlers

import (
	"encoding/json"
	"net/http"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type CouponHandler struct {
	svc service.CouponService
}

func NewCouponHandler(svc service.CouponService) *CouponHandler {
	return &CouponHandler{svc: svc}
}

func (h *CouponHandler) HandleValidateCoupon(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Code       string                `json:"code"`
		OrderTotal float64               `json:"orderTotal"`
		Total      float64               `json:"total"`
		Subtotal   float64               `json:"subtotal"`
		Items      []models.CartItemInfo `json:"items"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid request payload"}`))
		return
	}

	total := req.OrderTotal
	if total <= 0 {
		total = req.Total
	}
	if total <= 0 {
		total = req.Subtotal
	}

	coupon, discountAmt, err := h.svc.ValidateCoupon(req.Code, total, req.Items)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	resp := map[string]interface{}{
		"valid":          true,
		"coupon":         coupon,
		"discountAmount": discountAmt,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *CouponHandler) HandleAdminCoupons(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		coupons, err := h.svc.GetAllCoupons()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(coupons)
	} else if r.Method == http.MethodPost {
		var c models.Coupon
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}
		if err := h.svc.CreateCoupon(&c); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(c)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *CouponHandler) HandleUserCoupons(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	coupons, err := h.svc.GetAllCoupons()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	reqUserID := r.Header.Get("X-User-Id")

	var userCoupons []map[string]interface{}
	for _, c := range coupons {
		if c.IsActive && (c.UserID == "" || c.UserID == reqUserID) {
			userCoupons = append(userCoupons, map[string]interface{}{
				"id":         c.ID,
				"code":       c.Code,
				"type":       c.Type,
				"value":      c.Value,
				"minOrder":   c.MinOrder,
				"expiryDate": c.ExpiryDate,
				"isActive":   c.IsActive,
				"usageLimit": c.UsageLimit,
				"usedCount":  c.UsedCount,
			})
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(userCoupons)
}

func (h *CouponHandler) HandleGetGiftTiers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	tiers, err := h.svc.GetGiftTiers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tiers)
}
