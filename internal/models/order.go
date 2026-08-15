package models

// OrderItem represents an item details bought in an order
type OrderItem struct {
	ProductID   string  `json:"productId"`
	Quantity    int     `json:"quantity"`
	PriceAtQty  float64 `json:"priceAtQty"`
	ProductName string  `json:"productName,omitempty"`
	Size        string  `json:"size,omitempty"`
}

// CartItemInfo represents the minimal item data sent by the frontend for coupon validation
type CartItemInfo struct {
	ProductID string  `json:"id"`
	Price     float64 `json:"price"`
	Quantity  int     `json:"quantity"`
	Name      string  `json:"name"`
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
