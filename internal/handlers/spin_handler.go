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
	configSvc  service.ConfigService
}

func NewSpinHandler(profileSvc service.ProfileService, couponSvc service.CouponService, configSvc service.ConfigService) *SpinHandler {
	return &SpinHandler{
		profileSvc: profileSvc,
		couponSvc:  couponSvc,
		configSvc:  configSvc,
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
		http.Error(w, "Profile not found", http.StatusNotFound)
		return
	}

	config, err := h.configSvc.GetSpinWheelConfig()
	if err != nil || !config.Enabled {
		http.Error(w, "Spin & Win is currently disabled", http.StatusForbidden)
		return
	}

	if profile.AvailableSpins <= 0 {
		http.Error(w, "No spins available. Place an order to earn more spins!", http.StatusForbidden)
		return
	}

	isFirstTime := profile.SpinCount == 0
	stats, _ := h.configSvc.GetSpinWheelStats()

	segmentIndex := -1
	
	// Check triggers for Free Kurthi
	triggeredFreeKurthi := false
	if stats.NewUsersSinceLastKurthi >= config.NewUserKurthiThreshold && config.NewUserKurthiThreshold > 0 {
		triggeredFreeKurthi = true
		h.configSvc.ResetNewUserKurthiCounter()
	} else if stats.OrdersSinceLastKurthi >= config.OrderKurthiThreshold && config.OrderKurthiThreshold > 0 {
		triggeredFreeKurthi = true
		h.configSvc.ResetOrderKurthiCounter()
	}

	if triggeredFreeKurthi {
		segmentIndex = 0 // 0 = Free Kurthi
	} else {
		// Pure Probabilities
		var probs models.SpinWheelProbs
		if isFirstTime {
			probs = config.FirstTimeProbs
		} else {
			probs = config.ReturningProbs
		}
		
		probabilities := []int{0, probs.Prob5Off, probs.Prob10Off, probs.ProbBetterLuck}
		
		rand.Seed(time.Now().UnixNano())
		roll := rand.Intn(100)
		sum := 0
		for i, p := range probabilities {
			sum += p
			if roll < sum {
				segmentIndex = i
				break
			}
		}
		
		if segmentIndex == -1 {
			segmentIndex = 3 // Fallback to Better Luck
		}
	}

	var generatedCoupon *models.Coupon

	if segmentIndex == 0 {
		// Generate 100% off coupon for Kurthi (or a physical coupon as a placeholder)
		code := fmt.Sprintf("SPIN-FREEKURTHI-%d", rand.Intn(90000)+10000)
		expiry := time.Now().AddDate(0, 0, 7).Format("2006-01-02")
		c := &models.Coupon{
			ID:         fmt.Sprintf("cpn_spin_%d", time.Now().UnixNano()),
			Code:       code,
			Type:       "percentage",
			Value:      100.0,
			MinOrder:   0,
			ExpiryDate: expiry,
			IsActive:   true,
			UsageLimit: 1,
			UsedCount:  0,
		}
		if err := h.couponSvc.CreateCoupon(c); err == nil {
			generatedCoupon = c
		}
	} else if segmentIndex == 1 || segmentIndex == 2 {
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

	// Consume ticket and increment spin count
	h.profileSvc.ConsumeSpinTicket(userID)

	resp := SpinResponse{
		SegmentIndex: segmentIndex,
		Coupon:       generatedCoupon,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
