package models

// Product represents a item in our store
type Product struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	Description   string            `json:"description"`
	Price         float64           `json:"price"`
	ImageURL      string            `json:"imageUrl"`
	GalleryImages []string          `json:"galleryImages"`
	Sizes         []string          `json:"sizes"`
	SizesStock    map[string]int    `json:"sizesStock"` // Maps size string (e.g. "S") to stock count
	Stock         int               `json:"stock"`
	Category      string            `json:"category"`
	Collection    string            `json:"collection"`
	Fabric        string            `json:"fabric"`
	Color         string            `json:"color"`
	SleeveType    string            `json:"sleeveType"`
	NeckType      string            `json:"neckType"`
	Pattern       string            `json:"pattern"`
	Occasion      string            `json:"occasion"`
	SKU           string            `json:"sku"`
	Tags          string            `json:"tags"`
	OriginalPrice float64           `json:"originalPrice"`
	IsNewArrival  bool              `json:"isNewArrival"`
	IsBestSeller  bool              `json:"isBestSeller"`
	IsFeatured    bool              `json:"isFeatured"`
	CreatedAt     string            `json:"createdAt"`
	AvgRating     float64           `json:"avgRating"`
	ReviewCount   int               `json:"reviewCount"`
}

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
}

// OrderItem represents a item details bought in an order
type OrderItem struct {
	ProductID   string  `json:"productId"`
	Quantity    int     `json:"quantity"`
	PriceAtQty  float64 `json:"priceAtQty"`
	ProductName string  `json:"productName,omitempty"`
	Size        string  `json:"size,omitempty"`
}

// ProductReview represents a customer rating and comment
type ProductReview struct {
	ID        int    `json:"id"`
	ProductID string `json:"productId"`
	UserName  string `json:"userName"`
	UserEmail string `json:"userEmail"`
	Rating    int    `json:"rating"`
	Comment   string `json:"comment"`
	CreatedAt string `json:"createdAt"`
}

// Order represents a customer purchase
type Order struct {
	ID                string      `json:"id"`
	CustomerEmail     string      `json:"customerEmail"`
	TotalAmount       float64     `json:"totalAmount"`
	DiscountAmt       float64     `json:"discountAmt"`
	CouponCode        string      `json:"couponCode"`
	Status            string      `json:"status"` // "pending", "paid", "shipped", "cancelled", "ready_for_pickup", "dispatched_instant"
	CreatedAt         string      `json:"createdAt"`
	RazorpayOrderID   string      `json:"razorpayOrderId"`
	RazorpayPaymentID string      `json:"razorpayPaymentId"`
	TrackingNumber    string      `json:"trackingNumber"`
	ShippedAt         string      `json:"shippedAt"`
	Items             []OrderItem `json:"items"`
	UnlockedGift      string      `json:"unlockedGift"`
	ShippingName      string      `json:"shippingName"`
	ShippingPhone     string      `json:"shippingPhone"`
	ShippingAddress   string      `json:"shippingAddress"`
	ShippingCity      string      `json:"shippingCity"`
	ShippingState     string      `json:"shippingState"`
	ShippingZIPCode   string      `json:"shippingZipCode"`
	CheckoutType      string      `json:"checkoutType"`
	PaymentMethod     string      `json:"paymentMethod"`
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

type Profile struct {
	UserID        string `json:"userId"`
	Email         string `json:"email"`
	FullName      string `json:"fullName"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	City          string `json:"city"`
	State         string `json:"state"`
	ZIPCode       string `json:"zipCode"`
	PreferredSize string `json:"preferredSize,omitempty"`
	StyleNotes    string `json:"styleNotes,omitempty"`
	CreatedAt     string `json:"createdAt"`
	UpdatedAt     string `json:"updatedAt"`
}

type Address struct {
	ID          int    `json:"id"`
	UserID      string `json:"userId"`
	FullName    string `json:"fullName"`
	Phone       string `json:"phone"`
	AddressLine string `json:"addressLine"`
	City        string `json:"city"`
	State       string `json:"state"`
	ZIPCode     string `json:"zipCode"`
	IsDefault   bool   `json:"isDefault"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

// OrderCreateRequest represents storefront payload to initiate booking
type OrderCreateRequest struct {
	CustomerEmail   string `json:"customerEmail"`
	CouponCode      string `json:"couponCode"`
	ShippingName    string `json:"shippingName"`
	ShippingPhone   string `json:"shippingPhone"`
	ShippingAddress string `json:"shippingAddress"`
	ShippingCity    string `json:"shippingCity"`
	ShippingState   string `json:"shippingState"`
	ShippingZIPCode string `json:"shippingZipCode"`
	CheckoutType    string `json:"checkoutType"`
	PaymentMethod   string `json:"paymentMethod"`
	Items           []struct {
		ProductID string `json:"productId"`
		Quantity  int    `json:"quantity"`
		Size      string `json:"size"`
	} `json:"items"`
}

// OrderVerifyRequest represents storefront verification cargo
type OrderVerifyRequest struct {
	OrderID           string `json:"orderId"`
	RazorpayOrderID   string `json:"razorpayOrderId"`
	RazorpayPaymentID string `json:"razorpayPaymentId"`
	RazorpaySignature string `json:"razorpaySignature"`
	Mock              bool   `json:"mock"`
}
