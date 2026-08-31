package service

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"ethnictouch/internal/models"
	"os"
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

func (m *mockOrderRepoForService) UpdateOrderStatusWithGiftTransaction(orderID, status, paymentID, unlockedGift string, newCoupon *models.Coupon) error {
	if o, ok := m.orders[orderID]; ok {
		o.Status = status
		o.RazorpayPaymentID = paymentID
		o.UnlockedGift = unlockedGift
	}
	return nil
}

type mockCouponServiceForOrder struct{}
func (m *mockCouponServiceForOrder) ValidateCoupon(code string, subtotal float64, items []models.CartItemInfo, userID string) (*models.Coupon, float64, error) { return nil, 0, nil }
func (m *mockCouponServiceForOrder) GetAllCoupons() ([]models.Coupon, error) { return nil, nil }
func (m *mockCouponServiceForOrder) CreateCoupon(c *models.Coupon) error { return nil }
func (m *mockCouponServiceForOrder) GetGiftTiers() ([]models.GiftTier, error) { return []models.GiftTier{}, nil }

func TestOrderService_VerifyPayment_HMACValidation(t *testing.T) {
	repo := &mockOrderRepoForService{
		orders: map[string]*models.Order{
			"ORD_1001": {
				ID:              "ORD_1001",
				RazorpayOrderID: "rzp_order_999",
				Status:          "pending",
			},
		},
	}

	configSvc := &mockConfigServiceForCheckout{}
	delhiverySvc := NewDelhiveryService("dummy")
	couponSvc := &mockCouponServiceForOrder{}
	svc := NewOrderService(repo, couponSvc, nil, configSvc, delhiverySvc)
	secret := "test_razorpay_secret_key"
	os.Setenv("RAZORPAY_KEY_SECRET", secret)
	defer os.Unsetenv("RAZORPAY_KEY_SECRET")

	orderID := "ORD_1001"
	rzpOrderID := "rzp_order_999"
	rzpPaymentID := "pay_888"

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

		_, err := svc.VerifyPayment(req)
		if err != nil {
			t.Errorf("Expected nil error for valid signature, got: %v", err)
		}
	})

	t.Run("Tampered / Invalid Signature Rejection", func(t *testing.T) {
		repo.orders["ORD_1001"].Status = "pending" // Reset status for next test

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
}
