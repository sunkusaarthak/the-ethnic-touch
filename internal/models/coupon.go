package models

// Coupon represents a discount code
type Coupon struct {
	ID         string  `json:"id"`
	Code       string  `json:"code"`
	Type       string  `json:"type"` // "fixed", "percentage"
	Value      float64 `json:"value"`
	MinOrder   float64 `json:"minOrder"`
	ExpiryDate string  `json:"expiryDate"`
	IsActive   bool    `json:"isActive"`
	UsageLimit int     `json:"usageLimit"`
	UsedCount  int     `json:"usedCount"`
	UserID     string  `json:"userId"`
}

// GiftTier represents a configured reward tier
type GiftTier struct {
	ID               int     `json:"id"`
	Name             string  `json:"name"`
	Threshold        float64 `json:"threshold"`
	RewardType       string  `json:"rewardType"`   // "coupon" or "physical"
	DiscountType     string  `json:"discountType"` // "percentage" or "fixed"
	DiscountValue    float64 `json:"discountValue"`
	CouponFormat     string  `json:"couponFormat"` // e.g. "GFT-SLVR-[RAND]"
	PhysicalName     string  `json:"physicalName"` // e.g. "Premium Keychain"
	CouponExpiryDays int     `json:"couponExpiryDays"`
}
