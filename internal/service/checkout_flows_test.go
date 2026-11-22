package service

import (
	"errors"
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
	"testing"
)

type mockOrderRepoForCheckoutFlows struct {
	repository.OrderRepository
	orders map[string]*models.Order
}

func (m *mockOrderRepoForCheckoutFlows) GetOrder(orderID string) (*models.Order, error) {
	if o, ok := m.orders[orderID]; ok {
		return o, nil
	}
	return nil, models.ErrNotFound
}

func (m *mockOrderRepoForCheckoutFlows) UpdateOrderPaymentMethod(orderID, method string) error {
	return nil
}

func (m *mockOrderRepoForCheckoutFlows) ConfirmStorePickup(orderID string) error {
	return nil
}

func (m *mockOrderRepoForCheckoutFlows) GetAllOrders(email string) ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForCheckoutFlows) GetAdminOrders(orderID string) ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForCheckoutFlows) GetPendingDeliveryOrders() ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForCheckoutFlows) CreateOrderWithTransaction(order *models.Order, stockDeductions map[string]int, couponCode string) error {
	m.orders[order.ID] = order
	return nil
}

func (m *mockOrderRepoForCheckoutFlows) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	if o, ok := m.orders[orderID]; ok {
		o.Status = status
		o.RazorpayPaymentID = paymentID
	}
	return nil
}

func (m *mockOrderRepoForCheckoutFlows) GetOrderByRazorpayID(string) (*models.Order, error) {
	return nil, models.ErrNotFound
}

func (m *mockOrderRepoForCheckoutFlows) RecordCapturedPayment(string, string) (string, bool, error) {
	return "", false, models.ErrNotFound
}

func (m *mockOrderRepoForCheckoutFlows) SaveOrderGift(string, string, *models.Coupon) (string, error) {
	return "", models.ErrNotFound
}

func (m *mockOrderRepoForCheckoutFlows) CancelPendingOrder(orderID string) error {
	return nil
}

func (m *mockOrderRepoForCheckoutFlows) ConfirmPreorderPickup(orderID, adminEmail, notes string) error {
	return nil
}

func (m *mockOrderRepoForCheckoutFlows) MarkPreorderPickupReady(orderID string) error {
	return nil
}

func (m *mockOrderRepoForCheckoutFlows) MarkAllPreorderPickupReady() (int, error) {
	return 0, nil
}

func (m *mockOrderRepoForCheckoutFlows) GetPreorderPickupOrders(filter string) ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForCheckoutFlows) GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error) {
	return nil, nil
}

func (m *mockOrderRepoForCheckoutFlows) MarkPickupNotificationSent(orderID string) error {
	return nil
}

type mockProductRepoForCheckoutFlows struct{}

func (m *mockProductRepoForCheckoutFlows) GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error) {
	return []models.Product{
		{
			ID:    "p_hyd_101",
			Name:  "Hyderabad Special Kurti",
			Price: 449,
			Stock: 10,
		},
	}, map[string]interface{}{"total": 1}, nil
}

func (m *mockProductRepoForCheckoutFlows) CreateProduct(p *models.Product) error { return nil }
func (m *mockProductRepoForCheckoutFlows) UpdateProduct(p *models.Product) error { return nil }
func (m *mockProductRepoForCheckoutFlows) DeleteProduct(id string) error         { return nil }
func (m *mockProductRepoForCheckoutFlows) GetReviews(productID string) ([]models.ProductReview, error) {
	return nil, nil
}
func (m *mockProductRepoForCheckoutFlows) CreateReview(rev *models.ProductReview) error { return nil }
func (m *mockProductRepoForCheckoutFlows) GetProductByID(id string) (*models.Product, error) {
	return nil, nil
}

type mockConfigServiceForCheckout struct{}

func (m *mockConfigServiceForCheckout) GetCheckoutConfig() (*models.CheckoutConfig, error) {
	return &models.CheckoutConfig{
		StandardDeliveryEnabled:      true,
		HyderabadInstantEnabled:      true,
		StorePickupPrepayEnabled:     true,
		StorePickupPayInStoreEnabled: true,
		FreeShippingThreshold:        1449.0,
	}, nil
}
func (m *mockConfigServiceForCheckout) UpdateCheckoutConfig(c *models.CheckoutConfig) error {
	return nil
}
func (m *mockConfigServiceForCheckout) GetOrderKurthiCounter() (int, error) { return 0, nil }
func (m *mockConfigServiceForCheckout) IncrementOrderKurthiCounter() error  { return nil }
func (m *mockConfigServiceForCheckout) GetSpinWheelConfig() (*models.SpinWheelConfig, error) {
	return nil, nil
}
func (m *mockConfigServiceForCheckout) UpdateSpinWheelConfig(config *models.SpinWheelConfig) error {
	return nil
}
func (m *mockConfigServiceForCheckout) GetSpinWheelStats() (*models.SpinWheelStats, error) {
	return nil, nil
}
func (m *mockConfigServiceForCheckout) IncrementNewUserKurthiCounter() error             { return nil }
func (m *mockConfigServiceForCheckout) ResetNewUserKurthiCounter() error                 { return nil }
func (m *mockConfigServiceForCheckout) ResetOrderKurthiCounter() error                   { return nil }
func (m *mockConfigServiceForCheckout) GetAuthConfig() (*models.AuthConfig, error)       { return nil, nil }
func (m *mockConfigServiceForCheckout) UpdateAuthConfig(config *models.AuthConfig) error { return nil }
func (m *mockConfigServiceForCheckout) GetHomepageConfig() (*models.HomepageConfig, error) {
	return nil, nil
}
func (m *mockConfigServiceForCheckout) UpdateHomepageConfig(config *models.HomepageConfig) error {
	return nil
}
func (m *mockConfigServiceForCheckout) GetPreorderPickupConfig() (*models.PreorderPickupConfig, error) {
	return &models.PreorderPickupConfig{
		Enabled:             true,
		LocationName:        "The Ethnic Touch Store",
		Address:             "ESCI Road, Khajaguda",
		City:                "Hyderabad",
		State:               "Telangana",
		ZipCode:             "500032",
		EstimatedPickupDate: "Within 2-3 weeks",
	}, nil
}
func (m *mockConfigServiceForCheckout) UpdatePreorderPickupConfig(config *models.PreorderPickupConfig) error {
	return nil
}

func TestCheckoutFlows_OfflinePickupAndInstantDelivery(t *testing.T) {
	orderRepo := &mockOrderRepoForCheckoutFlows{orders: make(map[string]*models.Order)}
	productRepo := &mockProductRepoForCheckoutFlows{}

	configSvc := &mockConfigServiceForCheckout{}
	delhiverySvc := NewDelhiveryService("dummy", "", "mock")

	svc := NewOrderService(orderRepo, nil, productRepo, configSvc, delhiverySvc)

	t.Run("Instant delivery uses the carrier quote and requires a local address", func(t *testing.T) {
		charge, err := svc.QuoteDelivery("hyderabad_instant", "Hyderabad", "500081", 1, 44900)
		if err != nil || charge != 5900 {
			t.Fatalf("instant quote = %d, %v; want 5900 paise", charge, err)
		}
		if _, err := svc.QuoteDelivery("hyderabad_instant", "Pune", "411001", 1, 44900); !errors.Is(err, ErrDeliveryNotServiceable) {
			t.Fatalf("expected outside area to be rejected, got %v", err)
		}
		if _, err := svc.QuoteDelivery("delivery", "", "999999", 1, 200000); !errors.Is(err, ErrDeliveryNotServiceable) {
			t.Fatalf("expected free shipping to require serviceability, got %v", err)
		}
		expected := int64(44900) // Simulates the pre-fix checkout total without shipping.
		req := &models.OrderCreateRequest{
			CheckoutType: "hyderabad_instant", PaymentMethod: "online", ExpectedTotalPaise: &expected,
			ShippingName: "Ananya", ShippingPhone: "9876543210", ShippingAddress: "Test address",
			ShippingCity: "Hyderabad", ShippingState: "Telangana", ShippingZIPCode: "500081",
		}
		req.Items = append(req.Items, struct {
			ProductID string `json:"productId"`
			Quantity  int    `json:"quantity"`
			Size      string `json:"size"`
		}{ProductID: "p_hyd_101", Quantity: 1, Size: "M"})
		var priceChanged *PriceChangedError
		if _, _, _, err := svc.CreateOrder(req); !errors.As(err, &priceChanged) || priceChanged.TotalPaise != expected+charge {
			t.Fatalf("expected order total plus quoted shipping before creating a provider order, got %v", err)
		}
	})

	t.Run("Offline Store Pickup Flow", func(t *testing.T) {
		req := &models.OrderCreateRequest{
			CustomerEmail: "customer@test.com",
			PaymentMethod: "offline_qr",
			CheckoutType:  "pickup",
			Items: []struct {
				ProductID string `json:"productId"`
				Quantity  int    `json:"quantity"`
				Size      string `json:"size"`
			}{
				{ProductID: "p_hyd_101", Quantity: 1, Size: "M"},
			},
		}

		order, providerOrderID, checkoutURL, err := svc.CreateOrder(req)
		if err != nil {
			t.Fatalf("Expected offline pickup order creation success, got: %v", err)
		}

		if providerOrderID != "OFFLINE_QR" {
			t.Errorf("Expected providerOrderID OFFLINE_QR, got %s", providerOrderID)
		}

		if checkoutURL != "/checkout-success" {
			t.Errorf("Expected checkoutURL /checkout-success, got %s", checkoutURL)
		}

		if order.Status != "pending_payment" && order.Status != "ready_for_pickup" {
			t.Errorf("Expected order status pending_payment/ready_for_pickup, got %s", order.Status)
		}
	})
}
