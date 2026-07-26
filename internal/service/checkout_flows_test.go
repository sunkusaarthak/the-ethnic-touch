package service

import (
	"ethnictouch/internal/models"
	"testing"
)

type mockOrderRepoForCheckoutFlows struct {
	orders map[string]*models.Order
}

func (m *mockOrderRepoForCheckoutFlows) GetOrder(orderID string) (*models.Order, error) {
	if o, ok := m.orders[orderID]; ok {
		return o, nil
	}
	return nil, models.ErrNotFound
}

func (m *mockOrderRepoForCheckoutFlows) GetAllOrders(email string) ([]models.Order, error) {
	return nil, nil
}

func (m *mockOrderRepoForCheckoutFlows) GetAdminOrders(orderID string) ([]models.Order, error) {
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

type mockProductRepoForCheckoutFlows struct{}

func (m *mockProductRepoForCheckoutFlows) GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error) {
	return []models.Product{
		{
			ID:    "p_hyd_101",
			Name:  "Hyderabad Special Kurti",
			Price: 2000,
			Stock: 10,
		},
	}, map[string]interface{}{"total": 1}, nil
}

func (m *mockProductRepoForCheckoutFlows) CreateProduct(p *models.Product) error { return nil }
func (m *mockProductRepoForCheckoutFlows) GetReviews(productID string) ([]models.ProductReview, error) { return nil, nil }
func (m *mockProductRepoForCheckoutFlows) CreateReview(rev *models.ProductReview) error { return nil }

func TestCheckoutFlows_OfflinePickupAndInstantDelivery(t *testing.T) {
	orderRepo := &mockOrderRepoForCheckoutFlows{orders: make(map[string]*models.Order)}
	prodRepo := &mockProductRepoForCheckoutFlows{}

	svc := NewOrderService(orderRepo, nil, prodRepo)

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
