package service

import (
	"strings"
	"testing"

	"github.com/joho/godotenv"

	"ethnictouch/internal/config"
	"ethnictouch/internal/models"
)

func TestEmailService_IsConfigured(t *testing.T) {
	svcUnconfigured := NewEmailService(&config.Config{})
	if svcUnconfigured.IsConfigured() {
		t.Errorf("Expected IsConfigured to be false with empty credentials")
	}

	svcConfigured := NewEmailService(&config.Config{
		GmailUser:        "test@example.com",
		GmailAppPassword: "mock-test-token",
	})
	if !svcConfigured.IsConfigured() {
		t.Errorf("Expected IsConfigured to be true with credentials set")
	}
}

func TestEmailService_MockModeSend(t *testing.T) {
	// Mock mode should succeed without error when unconfigured
	svc := NewEmailService(&config.Config{})
	err := svc.SendEmail("customer@example.com", "Test Subject", "<p>Hello</p>", "Hello")
	if err != nil {
		t.Fatalf("Expected mock SendEmail to succeed, got %v", err)
	}

	order := &models.Order{
		ID:            "ORD_123456",
		CustomerEmail: "customer@example.com",
		ShippingName:  "Sunku Saarthak",
		TotalAmount:   1098.0,
		DiscountAmt:   100.0,
		CouponCode:    "FESTIVE100",
		Status:        "paid",
		CheckoutType:  "delivery",
		PaymentMethod: "online",
		ShippingAddress: "Villa 42, Palm Meadows",
		ShippingCity:    "Hyderabad",
		ShippingState:   "Telangana",
		ShippingZIPCode: "500075",
		ShippingPhone:   "9876543210",
		Items: []models.OrderItem{
			{
				ProductID:   "p_1",
				ProductName: "Navy Blue Floral Kurti",
				Quantity:    2,
				PriceAtQty:  599.0,
				Size:        "M",
			},
		},
	}

	// Test order confirmation
	if err := svc.SendOrderConfirmation(order); err != nil {
		t.Errorf("Expected SendOrderConfirmation to succeed in mock mode, got %v", err)
	}

	// Test store pickup confirmation
	order.CheckoutType = "store_pickup"
	if err := svc.SendOrderConfirmation(order); err != nil {
		t.Errorf("Expected SendOrderConfirmation (pickup) to succeed in mock mode, got %v", err)
	}

	// Test order shipped
	if err := svc.SendOrderShipped(order, "DLV_1234567890"); err != nil {
		t.Errorf("Expected SendOrderShipped to succeed in mock mode, got %v", err)
	}

	// Test order picked up
	if err := svc.SendOrderPickedUp(order); err != nil {
		t.Errorf("Expected SendOrderPickedUp to succeed in mock mode, got %v", err)
	}
}

func TestEmailService_TemplateRenderContent(t *testing.T) {
	order := &models.Order{
		ID:            "ORD_778899",
		CustomerEmail: "test@theethnictouch.com",
		ShippingName:  "Aarohi Sharma",
		TotalAmount:   549.0,
		DiscountAmt:   50.0,
		CouponCode:    "WELCOME50",
		UnlockedGift:  "Handcrafted Potli Bag",
		CheckoutType:  "store_pickup",
		PaymentMethod: "offline_qr",
		Items: []models.OrderItem{
			{
				ProductID:   "p_Na_10200",
				ProductName: "Navy Blue Printed Straight Kurti",
				Quantity:    1,
				PriceAtQty:  599.0,
				Size:        "L",
				ImageURL:    "https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/products/Navy_Blue_1.png",
			},
		},
	}

	// Check HTML template
	html := renderOrderConfirmationHTML(order)
	if !strings.Contains(html, "ORD_778899") {
		t.Errorf("HTML template missing Order ID")
	}
	if !strings.Contains(html, "Aarohi Sharma") {
		t.Errorf("HTML template missing customer name")
	}
	if !strings.Contains(html, "Navy Blue Printed Straight Kurti") {
		t.Errorf("HTML template missing product name")
	}
	if !strings.Contains(html, "Size: L") {
		t.Errorf("HTML template missing product size")
	}
	if !strings.Contains(html, "WELCOME50") {
		t.Errorf("HTML template missing coupon code")
	}
	if !strings.Contains(html, "Handcrafted Potli Bag") {
		t.Errorf("HTML template missing unlocked gift")
	}
	if !strings.Contains(html, "Khajaguda Lake") {
		t.Errorf("HTML template missing Khajaguda store details")
	}

	// Check text template
	text := renderOrderConfirmationText(order)
	if !strings.Contains(text, "ORD_778899") {
		t.Errorf("Text template missing Order ID")
	}

	// Check Shipped template
	shippedHTML := renderOrderShippedHTML(order, "DELHIVERY_TRACK_999")
	if !strings.Contains(shippedHTML, "DELHIVERY_TRACK_999") {
		t.Errorf("Shipped HTML missing tracking number")
	}
	if !strings.Contains(shippedHTML, "Track on Delhivery") {
		t.Errorf("Shipped HTML missing track button")
	}

	// Check Picked Up template
	pickedUpHTML := renderOrderPickedUpHTML(order)
	if !strings.Contains(pickedUpHTML, "ORDER PICKED UP") {
		t.Errorf("Picked up HTML missing badge")
	}
	if !strings.Contains(pickedUpHTML, "Cotton &amp; Dye Care Guide") && !strings.Contains(pickedUpHTML, "Cotton & Dye Care Guide") {
		t.Errorf("Picked up HTML missing care guide")
	}
}

func TestEmailService_StorePickupContexts(t *testing.T) {
	// 1. Prepaid Store Pickup (paid online, pickup at boutique)
	prepaidOrder := &models.Order{
		ID:            "ORD_PREPAID_999",
		CustomerEmail: "priya.sharma@example.com",
		ShippingName:  "Store Pickup Customer",
		TotalAmount:   799.0,
		Status:        "paid",
		CheckoutType:  "pickup",
		PaymentMethod: "online",
		Items: []models.OrderItem{
			{ProductID: "p1", ProductName: "Jaipur Floral Kurti", Quantity: 1, PriceAtQty: 799.0, Size: "M"},
		},
	}

	prepaidHTML := renderOrderConfirmationHTML(prepaidOrder)
	if !strings.Contains(prepaidHTML, "PREPAID STORE PICKUP &bull; FULLY PAID") {
		t.Errorf("Expected prepaid status badge in HTML")
	}
	if !strings.Contains(prepaidHTML, "Your In-Store Collection is Confirmed") {
		t.Errorf("Expected in-store collection confirmed headline")
	}
	if !strings.Contains(prepaidHTML, "Store Verification Scanner Pass") {
		t.Errorf("Expected scanner pass in prepaid store pickup")
	}
	if !strings.Contains(prepaidHTML, "Store Collection Point") {
		t.Errorf("Expected Store Collection Point in store pickup")
	}
	if strings.Contains(strings.ToLower(prepaidHTML), "boutique") {
		t.Errorf("Prepaid HTML should NOT contain the word boutique")
	}
	if strings.Contains(prepaidHTML, "Delivery Destination") {
		t.Errorf("Prepaid store pickup should NEVER contain Delivery Destination")
	}
	if strings.Contains(prepaidHTML, "0000000000") {
		t.Errorf("Prepaid store pickup should NEVER contain 0000000000 phone number")
	}
	if strings.Contains(prepaidHTML, "Express Dispatch Promise") {
		t.Errorf("Store pickup should NEVER contain Delhivery dispatch promise")
	}
	if !strings.Contains(prepaidHTML, "Dear Priya Sharma") {
		t.Errorf("Expected greeting derived from email prefix, got HTML missing 'Dear Priya Sharma'")
	}

	// 2. Unpaid Store Pickup (offline_qr, pending payment at boutique)
	unpaidOrder := &models.Order{
		ID:            "ORD_UNPAID_111",
		CustomerEmail: "ananya.patel@example.com",
		ShippingName:  "Store Pickup Customer",
		TotalAmount:   1299.0,
		Status:        "pending_payment",
		CheckoutType:  "pickup",
		PaymentMethod: "offline_qr",
		Items: []models.OrderItem{
			{ProductID: "p2", ProductName: "Jaipur Flared Anarkali Kurti", Quantity: 1, PriceAtQty: 1299.0, Size: "L"},
		},
	}

	unpaidHTML := renderOrderConfirmationHTML(unpaidOrder)
	if !strings.Contains(unpaidHTML, "STORE PICKUP RESERVED &bull; PAY AT STORE") {
		t.Errorf("Expected unpaid store pickup reserved badge in HTML")
	}
	if !strings.Contains(unpaidHTML, "Payment Due on Collection: ₹1299.00") {
		t.Errorf("Expected payment due note in unpaid store pickup")
	}
	if !strings.Contains(unpaidHTML, "Store Collection Point") {
		t.Errorf("Expected Store Collection Point in unpaid store pickup")
	}
	if strings.Contains(strings.ToLower(unpaidHTML), "boutique") {
		t.Errorf("Unpaid HTML should NOT contain the word boutique")
	}
	if strings.Contains(unpaidHTML, "Delivery Destination") {
		t.Errorf("Unpaid store pickup should NEVER contain Delivery Destination")
	}
	if strings.Contains(unpaidHTML, "0000000000") {
		t.Errorf("Unpaid store pickup should NEVER contain 0000000000 phone number")
	}

	// 3. Delivery Order
	deliveryOrder := &models.Order{
		ID:              "ORD_DELIVERY_555",
		CustomerEmail:   "deepa@example.com",
		ShippingName:    "Deepa Reddy",
		ShippingAddress: "Banjara Hills, Road No 12",
		ShippingCity:    "Hyderabad",
		ShippingState:   "Telangana",
		ShippingZIPCode: "500034",
		ShippingPhone:   "9123456789",
		TotalAmount:     1599.0,
		Status:          "paid",
		CheckoutType:    "delivery",
		PaymentMethod:   "online",
		Items: []models.OrderItem{
			{ProductID: "p3", ProductName: "Indigo Blue Cotton Kurti", Quantity: 1, PriceAtQty: 1599.0, Size: "S"},
		},
	}

	deliveryHTML := renderOrderConfirmationHTML(deliveryOrder)
	if !strings.Contains(deliveryHTML, "Delivery Destination") {
		t.Errorf("Delivery order MUST contain Delivery Destination card")
	}
	if !strings.Contains(deliveryHTML, "Banjara Hills, Road No 12") {
		t.Errorf("Delivery order MUST show shipping address")
	}
	if !strings.Contains(deliveryHTML, "Express Dispatch Promise") {
		t.Errorf("Delivery order MUST contain dispatch promise")
	}
	if strings.Contains(deliveryHTML, "Store Collection Point") {
		t.Errorf("Delivery order should NOT contain Store Collection Point")
	}
	if strings.Contains(strings.ToLower(deliveryHTML), "boutique") {
		t.Errorf("Delivery HTML should NOT contain the word boutique")
	}
}

func TestEmailService_CustomerGreeting(t *testing.T) {
	cases := []struct {
		name     string
		email    string
		expected string
	}{
		{"Sunku Saarthak", "sunku@gmail.com", "Sunku Saarthak"},
		{"Store Pickup Customer", "sunkusaarthak@gmail.com", "Sunkusaarthak"},
		{"Store Pickup Customer", "priya.sharma@gmail.com", "Priya Sharma"},
		{"", "meera_kapoor@yahoo.com", "Meera Kapoor"},
		{"", "", "Valued Patron"},
	}

	for _, c := range cases {
		order := &models.Order{ShippingName: c.name, CustomerEmail: c.email}
		res := getCustomerDisplayName(order)
		if res != c.expected {
			t.Errorf("For name '%s' / email '%s', expected '%s', got '%s'", c.name, c.email, c.expected, res)
		}
	}
}

func TestEmailDeliveryMethodTakesPrecedenceOverAddress(t *testing.T) {
	order := &models.Order{
		CheckoutType:    "delivery",
		PaymentMethod:   "online",
		ShippingAddress: "Lake Road, Financial District",
	}
	if isStorePickup(order) {
		t.Fatal("an explicit delivery order should use delivery emails even when its street name resembles the store address")
	}
}

func TestEmailService_LiveSMTPVerification(t *testing.T) {
	if testing.Short() {
		t.Skip("Skipping live SMTP test in short mode")
	}
	_ = godotenv.Load("../../.env")
	cfg := config.LoadConfig()
	svc := NewEmailService(cfg)
	if !svc.IsConfigured() {
		t.Skip("Skipping live SMTP test because email credentials are not set")
	}

	err := svc.VerifyConnection()
	if err != nil {
		t.Fatalf("Live SMTP handshake and authentication failed: %v", err)
	}
}

func TestEmailService_SecuritySanitization(t *testing.T) {
	svc := NewEmailService(nil)

	// 1. CRLF in recipient email address must be rejected
	crlfAddrs := []string{
		"victim@example.com\r\nBcc: evil@example.com",
		"victim@example.com\nSubject: Injected",
		"victim@example.com\rTo: another@example.com",
		"victim@example.com\x00attacker@evil.com",
	}
	for _, addr := range crlfAddrs {
		err := svc.SendEmail(addr, "Safe Subject", "<p>Hello</p>", "Hello")
		if err == nil {
			t.Errorf("Expected error for recipient address with control/CRLF chars %q, got nil", addr)
		}
	}

	// 2. HTML injection in customer name, address, and product names must be escaped
	xssOrder := &models.Order{
		ID:              "ORD_XSS_001",
		CustomerEmail:   "safe@example.com",
		ShippingName:    `<script>alert("XSS")</script>`,
		ShippingAddress: `123 Main St <b onmouseover="alert(1)">`,
		ShippingCity:    `<iframe src="evil.com">`,
		ShippingState:   `Telangana`,
		ShippingZIPCode: `500075`,
		ShippingPhone:   `+91 9999999999" onfocus="alert(1)`,
		PaymentMethod:   `online" onfocus="alert(1)`,
		CouponCode:      `DISCOUNT<script>`,
		UnlockedGift:    `Silk Stole<img src=x onerror=alert(1)>`,
		Items: []models.OrderItem{
			{
				ProductID:   `PROD" onmouseover="alert(1)`,
				ProductName: `Jaipur Kurti <img src=x onerror=alert(1)>`,
				Size:        `M<script>`,
				Quantity:    1,
				PriceAtQty:  1999.00,
			},
		},
	}

	htmlOutput := renderOrderConfirmationHTML(xssOrder)
	if strings.Contains(htmlOutput, "<script>") || strings.Contains(htmlOutput, "</script>") {
		t.Errorf("Rendered HTML contains unescaped <script> tag: %s", htmlOutput)
	}
	if strings.Contains(htmlOutput, `<iframe src="evil.com">`) {
		t.Errorf("Rendered HTML contains unescaped <iframe> tag")
	}
	if strings.Contains(htmlOutput, `<img src=x onerror=alert(1)>`) {
		t.Errorf("Rendered HTML contains unescaped img onerror injection")
	}
	if !strings.Contains(htmlOutput, `&lt;script&gt;`) {
		t.Errorf("Rendered HTML expected to contain escaped &lt;script&gt;")
	}

	// 3. Plain text email should strip carriage returns
	textOutput := renderOrderConfirmationText(xssOrder)
	if strings.Contains(textOutput, "\r") {
		t.Errorf("Plain text email should not contain carriage returns")
	}
}
