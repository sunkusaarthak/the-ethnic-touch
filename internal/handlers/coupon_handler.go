package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
	"ethnictouch/internal/utils"
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

	reqUserID := r.Header.Get("X-User-Id")
	coupon, discountAmt, err := h.svc.ValidateCoupon(req.Code, total, req.Items, reqUserID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": utils.FormatError(err)})
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
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(coupons)
	} else if r.Method == http.MethodPost {
		var req struct {
			models.Coupon
			IsActive *bool `json:"isActive"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid payload", http.StatusBadRequest)
			return
		}

		c := req.Coupon
		c.Code = strings.ToUpper(strings.TrimSpace(c.Code))
		if c.Code == "" {
			http.Error(w, "Coupon code is required", http.StatusBadRequest)
			return
		}
		if c.ID == "" {
			c.ID = fmt.Sprintf("cp_%d", time.Now().UnixNano())
		}
		if c.Type == "" {
			c.Type = "percentage"
		}
		if req.IsActive != nil {
			c.IsActive = *req.IsActive
		} else {
			c.IsActive = true
		}

		if err := h.svc.CreateCoupon(&c); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(c)
	} else if r.Method == http.MethodDelete {
		code := strings.ToUpper(strings.TrimSpace(r.URL.Query().Get("code")))
		if code == "" {
			var delReq struct {
				Code string `json:"code"`
			}
			_ = json.NewDecoder(r.Body).Decode(&delReq)
			code = strings.ToUpper(strings.TrimSpace(delReq.Code))
		}
		if code == "" {
			http.Error(w, "Coupon code is required", http.StatusBadRequest)
			return
		}
		if err := h.svc.DeleteCoupon(code); err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Coupon deleted successfully"})
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
		http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
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
		http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tiers)
}

func (h *CouponHandler) HandleUpdateGiftTiers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var tiers []models.GiftTier
	if err := json.NewDecoder(r.Body).Decode(&tiers); err != nil {
		http.Error(w, "Invalid input data: "+err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.svc.SaveGiftTiers(tiers); err != nil {
		http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Gift tiers saved successfully",
		"count":   len(tiers),
	})
}
