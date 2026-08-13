package handlers

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type SpinHandler struct {
	profileSvc service.ProfileService
	couponSvc  service.CouponService
}

func NewSpinHandler(profileSvc service.ProfileService, couponSvc service.CouponService) *SpinHandler {
	return &SpinHandler{
		profileSvc: profileSvc,
		couponSvc:  couponSvc,
	}
}

type SpinResponse struct {
	SegmentIndex int            `json:"segmentIndex"`
	Coupon       *models.Coupon `json:"coupon,omitempty"`
}

func (h *SpinHandler) HandleSpin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	profile, err := h.profileSvc.GetProfile(userID)
	if err != nil {
		// Create a stub profile if missing so we can track spin count
		profile = &models.Profile{
			UserID:   userID,
			FullName: "Guest",
			Phone:    "",
		}
		h.profileSvc.UpsertProfile(profile)
	}

	isFirstTime := profile.SpinCount == 0

	// Segments: 0: Free Kurthi, 1: 5% off, 2: 10% off, 3: Better luck next time
	var probabilities []int
	if isFirstTime {
		// 0% free kurthi, 60% 5% off, 40% 10% off, 0% better luck
		probabilities = []int{0, 60, 40, 0}
	} else {
		// 0% free kurthi, 20% 5% off, 5% 10% off, 75% better luck
		probabilities = []int{0, 20, 5, 75}
	}

	rand.Seed(time.Now().UnixNano())
	roll := rand.Intn(100)
	sum := 0
	segmentIndex := -1
	for i, p := range probabilities {
		sum += p
		if roll < sum {
			segmentIndex = i
			break
		}
	}
	
	// Fallback in case of weird probability array
	if segmentIndex == -1 {
		segmentIndex = 3
	}

	var generatedCoupon *models.Coupon

	if segmentIndex == 1 || segmentIndex == 2 {
		// Create a coupon
		var discount float64
		if segmentIndex == 1 {
			discount = 5.0
		} else {
			discount = 10.0
		}

		code := fmt.Sprintf("SPIN-%dOFF-%d", int(discount), rand.Intn(90000)+10000)
		expiry := time.Now().AddDate(0, 0, 7).Format("2006-01-02") // 7 days expiry

		c := &models.Coupon{
			ID:         fmt.Sprintf("cpn_spin_%d", time.Now().UnixNano()),
			Code:       code,
			Type:       "percentage",
			Value:      discount,
			MinOrder:   0,
			ExpiryDate: expiry,
			IsActive:   true,
			UsageLimit: 1,
			UsedCount:  0,
		}

		if err := h.couponSvc.CreateCoupon(c); err == nil {
			generatedCoupon = c
		}
	}

	// Increment spin count
	h.profileSvc.IncrementSpinCount(userID)

	resp := SpinResponse{
		SegmentIndex: segmentIndex,
		Coupon:       generatedCoupon,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
