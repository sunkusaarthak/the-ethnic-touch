package service

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"ethnictouch/internal/models"
	"io"
	"net/http"
	"strings"
	"testing"
)

type mockOrderRepoForService struct {
	orders map[string]*models.Order
}

func (m *mockOrderRepoForService) GetOrder(orderID string) (*models.Order, error) {
	if o, ok := m.orders[orderID]; ok {
		return o, nil
	}
	return nil, models.ErrNotFound
}

func (m *mockOrderRepoForService) UpdateOrderPaymentMethod(orderID, method string) error {
	return nil
}

func (m *mockOrderRepoForService) ConfirmStorePickup(orderID string) error {
	return nil
}

func (m *mockOrderRepoForService) CancelPendingOrder(orderID string) error {
	return nil
}

func (m *mockOrderRepoForService) GetAllOrders(email string) ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForService) GetAdminOrders(orderID string) ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForService) GetPendingDeliveryOrders() ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForService) CreateOrderWithTransaction(order *models.Order, stockDeductions map[string]int, couponCode string) error {
	m.orders[order.ID] = order
	return nil
}

func (m *mockOrderRepoForService) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	if o, ok := m.orders[orderID]; ok {
		o.Status = status
		o.RazorpayPaymentID = paymentID
	}
	return nil
}

func (m *mockOrderRepoForService) GetOrderByRazorpayID(providerID string) (*models.Order, error) {
	for _, order := range m.orders {
		if order.RazorpayOrderID == providerID {
			return order, nil
		}
	}
	return nil, models.ErrNotFound
}

func (m *mockOrderRepoForService) RecordCapturedPayment(orderID, paymentID string) (string, bool, error) {
	order, err := m.GetOrder(orderID)
	if err != nil {
		return "", false, err
	}
	if order.RazorpayPaymentID == paymentID {
		return order.Status, false, nil
	}
	if order.Status == "cancelled" {
		order.Status = "payment_review"
	} else {
		order.Status = "paid"
	}
	order.RazorpayPaymentID = paymentID
	return order.Status, true, nil
}

func (m *mockOrderRepoForService) SaveOrderGift(string, string, *models.Coupon) (string, error) {
	return "", errors.New("reward storage unavailable")
}

func (m *mockOrderRepoForService) ConfirmPreorderPickup(orderID, adminEmail, notes string) error {
	return nil
}

func (m *mockOrderRepoForService) MarkPreorderPickupReady(orderID string) error {
	return nil
}

func (m *mockOrderRepoForService) MarkAllPreorderPickupReady() (int, error) {
	return 0, nil
}

func (m *mockOrderRepoForService) GetPreorderPickupOrders(filter string) ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForService) GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error) {
	return nil, nil
}

func (m *mockOrderRepoForService) MarkPickupNotificationSent(orderID string) error {
	return nil
}

type mockCouponServiceForOrder struct{}

func (m *mockCouponServiceForOrder) ValidateCoupon(code string, subtotal float64, items []models.CartItemInfo, userID string) (*models.Coupon, float64, error) {
	return nil, 0, nil
}
func (m *mockCouponServiceForOrder) GetAllCoupons() ([]models.Coupon, error) { return nil, nil }
func (m *mockCouponServiceForOrder) CreateCoupon(c *models.Coupon) error     { return nil }
func (m *mockCouponServiceForOrder) DeleteCoupon(code string) error          { return nil }
func (m *mockCouponServiceForOrder) GetGiftTiers() ([]models.GiftTier, error) {
	return []models.GiftTier{{Threshold: 100, RewardType: "coupon", DiscountType: "percentage", DiscountValue: 5}}, nil
}
func (m *mockCouponServiceForOrder) SaveGiftTiers(tiers []models.GiftTier) error { return nil }

type paymentTestTransport func(*http.Request) (*http.Response, error)

func (transport paymentTestTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	return transport(req)
}

func TestOrderService_VerifyPayment_HMACValidation(t *testing.T) {
	repo := &mockOrderRepoForService{
		orders: map[string]*models.Order{
			"ORD_1001": {
				ID:              "ORD_1001",
				RazorpayOrderID: "order_999",
				PaymentMethod:   "online",
				TotalAmount:     299.99,
				Status:          "pending",
			},
		},
	}

	configSvc := &mockConfigServiceForCheckout{}
	delhiverySvc := NewDelhiveryService("dummy")
	couponSvc := &mockCouponServiceForOrder{}
	svc := NewOrderService(repo, couponSvc, nil, configSvc, delhiverySvc)
	secret := "test_razorpay_secret_key"
	t.Setenv("RAZORPAY_KEY_SECRET", secret)
	t.Setenv("RAZORPAY_KEY_ID", "rzp_test_key")

	orderID := "ORD_1001"
	rzpOrderID := "order_999"
	rzpPaymentID := "pay_888"
	payment := RazorpayPayment{ID: rzpPaymentID, OrderID: rzpOrderID, Amount: 29999, Currency: "INR", Status: "captured", Captured: true}
	client := razorpayHTTPClient
	t.Cleanup(func() { razorpayHTTPClient = client })
	razorpayHTTPClient = &http.Client{Transport: paymentTestTransport(func(req *http.Request) (*http.Response, error) {
		if req.URL.Path != "/v1/payments/pay_888" {
			return nil, errors.New("unexpected payment lookup")
		}
		body, _ := json.Marshal(payment)
		return &http.Response{StatusCode: http.StatusOK, Body: io.NopCloser(strings.NewReader(string(body)))}, nil
	})}
	confirmations := 0
	svc.SetPaymentConfirmedHandler(func(*models.Order) { confirmations++ })

	// Compute valid HMAC SHA-256 signature
	data := rzpOrderID + "|" + rzpPaymentID
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	validSignature := hex.EncodeToString(h.Sum(nil))

	t.Run("Valid HMAC Signature Verification", func(t *testing.T) {
		req := &models.OrderVerifyRequest{
			OrderID:           orderID,
			RazorpayOrderID:   rzpOrderID,
			RazorpayPaymentID: rzpPaymentID,
			RazorpaySignature: validSignature,
			Mock:              false,
		}

		response, err := svc.VerifyPayment(req)
		if err != nil {
			t.Fatalf("Captured payment should succeed even if reward storage is unavailable: %v", err)
		}
		if response.Status != "paid" || repo.orders[orderID].Status != "paid" {
			t.Fatalf("Captured payment was not saved: %+v", response)
		}
		if err := svc.RecordRazorpayCapture(payment); err != nil || confirmations != 1 {
			t.Fatalf("Duplicate webhook should not send a second confirmation, got %d confirmations and %v", confirmations, err)
		}
	})

	t.Run("Tampered / Invalid Signature Rejection", func(t *testing.T) {
		repo.orders["ORD_1001"].Status = "pending"

		req := &models.OrderVerifyRequest{
			OrderID:           orderID,
			RazorpayOrderID:   rzpOrderID,
			RazorpayPaymentID: rzpPaymentID,
			RazorpaySignature: "invalid_hacked_signature_string",
			Mock:              false,
		}

		_, err := svc.VerifyPayment(req)
		if err == nil {
			t.Errorf("Expected error for tampered signature, got nil")
		}
	})

	t.Run("Captured amount must match", func(t *testing.T) {
		order := repo.orders[orderID]
		order.Status, order.RazorpayPaymentID = "pending", ""
		wrongAmount := payment
		wrongAmount.Amount++
		if err := svc.RecordRazorpayCapture(wrongAmount); err == nil || order.Status != "pending" {
			t.Fatalf("Mismatched amount must leave the order pending, got %q and %v", order.Status, err)
		}
	})

	t.Run("Late capture requires review", func(t *testing.T) {
		order := repo.orders[orderID]
		order.Status, order.RazorpayPaymentID = "cancelled", ""
		if err := svc.RecordRazorpayCapture(payment); err != nil || order.Status != "payment_review" || confirmations != 1 {
			t.Fatalf("Late capture must be routed to review, got %q and %v", order.Status, err)
		}
	})
}
