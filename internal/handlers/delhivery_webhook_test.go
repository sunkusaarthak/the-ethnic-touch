package handlers

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
	"ethnictouch/internal/service"
)

type mockOrderRepoForWebhook struct {
	repository.OrderRepository
	orders map[string]*models.Order
}

func (m *mockOrderRepoForWebhook) RecordShipmentEvent(orderID, waybill string, event models.ShipmentEvent) error {
	order := m.orders[orderID]
	if order == nil || order.CheckoutType != "delivery" || order.TrackingNumber != waybill {
		return repository.ErrInvalidShipmentTransition
	}
	order.TrackingEvents = append(order.TrackingEvents, event)
	return nil
}

func (m *mockOrderRepoForWebhook) CreateOrderWithTransaction(order *models.Order, stockDeductions map[string]int, couponCode string) error {
	return nil
}
func (m *mockOrderRepoForWebhook) GetOrder(orderID string) (*models.Order, error) {
	return m.orders[orderID], nil
}
func (m *mockOrderRepoForWebhook) GetOrderByRazorpayID(razorpayOrderID string) (*models.Order, error) {
	return nil, nil
}
func (m *mockOrderRepoForWebhook) GetAllOrders(email string) ([]models.Order, error) { return nil, nil }
func (m *mockOrderRepoForWebhook) GetAdminOrders(orderID string) ([]models.Order, error) {
	return nil, nil
}
func (m *mockOrderRepoForWebhook) GetPendingDeliveryOrders() ([]models.Order, error) { return nil, nil }
func (m *mockOrderRepoForWebhook) ApplyCarrierTrackingUpdate(orderID, status, tracking, shippedAt string) error {
	o := m.orders[orderID]
	if o == nil || o.CheckoutType == "pickup" || (o.Status == "delivered" && status != "delivered") {
		return repository.ErrInvalidShipmentTransition
	}
	o.Status = status
	if tracking != "" {
		o.TrackingNumber = tracking
	}
	return nil
}
func (m *mockOrderRepoForWebhook) RecordCapturedPayment(orderID, paymentID string) (string, bool, error) {
	return "paid", true, nil
}
func (m *mockOrderRepoForWebhook) SaveOrderGift(orderID, gift string, coupon *models.Coupon) (string, error) {
	return "", nil
}
func (m *mockOrderRepoForWebhook) ConfirmStorePickup(orderID string) error { return nil }
func (m *mockOrderRepoForWebhook) CancelPendingOrder(orderID string) error { return nil }
func (m *mockOrderRepoForWebhook) ReleaseAbandonedPendingOrders(olderThan int) (int, error) {
	return 0, nil
}
func (m *mockOrderRepoForWebhook) ConfirmPreorderPickup(orderID, adminEmail, notes string) error {
	return nil
}
func (m *mockOrderRepoForWebhook) MarkPreorderPickupReady(orderID string) error { return nil }
func (m *mockOrderRepoForWebhook) MarkAllPreorderPickupReady() (int, error)     { return 0, nil }
func (m *mockOrderRepoForWebhook) GetPreorderPickupOrders(filter string) ([]models.Order, error) {
	return nil, nil
}
func (m *mockOrderRepoForWebhook) GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error) {
	return nil, nil
}
func (m *mockOrderRepoForWebhook) MarkPickupNotificationSent(orderID string) error { return nil }
func (m *mockOrderRepoForWebhook) RecordPreorderAudit(entry models.PreorderPickupAuditEntry) error {
	return nil
}

func computeSignature(payload []byte, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(payload)
	return hex.EncodeToString(mac.Sum(nil))
}

func TestDelhiveryWebhook_SecurityAndStateTransitions(t *testing.T) {
	secret := "test_delhivery_secret_key"
	delhiverySvc := service.NewDelhiveryService(secret, "", "mock")

	mockRepo := &mockOrderRepoForWebhook{
		orders: map[string]*models.Order{
			"ORD_DELIVERY_PAID": {
				ID:           "ORD_DELIVERY_PAID",
				Status:       "paid",
				CheckoutType: "delivery",
			},
			"ORD_DELIVERED": {
				ID:           "ORD_DELIVERED",
				Status:       "delivered",
				CheckoutType: "delivery",
			},
			"ORD_STORE_PICKUP": {
				ID:           "ORD_STORE_PICKUP",
				Status:       "paid",
				CheckoutType: "pickup",
			},
		},
	}

	orderSvc := service.NewOrderService(mockRepo, nil, nil, nil, delhiverySvc)
	handler := NewOrderHandler(orderSvc, nil, nil, delhiverySvc, nil)

	// 1. Missing or unconfigured secret / missing signature rejection
	t.Run("Rejects missing or invalid signature", func(t *testing.T) {
		body, _ := json.Marshal(map[string]interface{}{
			"order_id": "ORD_DELIVERY_PAID",
			"status":   "Dispatched",
		})
		req := httptest.NewRequest("POST", "/api/delhivery/webhook", bytes.NewReader(body))
		w := httptest.NewRecorder()
		handler.HandleDelhiveryWebhook(w, req)

		if w.Code != http.StatusUnauthorized {
			t.Fatalf("expected 401 Unauthorized for missing signature, got %d", w.Code)
		}
	})

	// 2. Unknown carrier status rejection (must NOT default to pending)
	t.Run("Rejects unknown carrier status without corrupting order state", func(t *testing.T) {
		body, _ := json.Marshal(map[string]interface{}{
			"order_id": "ORD_DELIVERY_PAID",
			"status":   "Manifested_Unknown_State",
		})
		sig := computeSignature(body, secret)
		req := httptest.NewRequest("POST", "/api/delhivery/webhook", bytes.NewReader(body))
		req.Header.Set("X-Delhivery-Signature", sig)
		w := httptest.NewRecorder()
		handler.HandleDelhiveryWebhook(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request for unknown status, got %d", w.Code)
		}
		if mockRepo.orders["ORD_DELIVERY_PAID"].Status != "paid" {
			t.Fatalf("order status was corrupted! Expected 'paid', got %q", mockRepo.orders["ORD_DELIVERY_PAID"].Status)
		}
	})

	// 3. Delayed carrier event after delivery rejection (backward transition prevented)
	t.Run("Rejects delayed in-transit event after delivery", func(t *testing.T) {
		body, _ := json.Marshal(map[string]interface{}{
			"order_id": "ORD_DELIVERED",
			"status":   "In Transit",
		})
		sig := computeSignature(body, secret)
		req := httptest.NewRequest("POST", "/api/delhivery/webhook", bytes.NewReader(body))
		req.Header.Set("X-Delhivery-Signature", sig)
		w := httptest.NewRecorder()
		handler.HandleDelhiveryWebhook(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request for backward state change, got %d", w.Code)
		}
		if mockRepo.orders["ORD_DELIVERED"].Status != "delivered" {
			t.Fatalf("delivered order reverted to %q", mockRepo.orders["ORD_DELIVERED"].Status)
		}
	})

	// 4. Store pickup order rejection (carrier webhooks cannot mutate store pickups)
	t.Run("Rejects carrier update for store pickup order", func(t *testing.T) {
		body, _ := json.Marshal(map[string]interface{}{
			"order_id": "ORD_STORE_PICKUP",
			"status":   "Dispatched",
		})
		sig := computeSignature(body, secret)
		req := httptest.NewRequest("POST", "/api/delhivery/webhook", bytes.NewReader(body))
		req.Header.Set("X-Delhivery-Signature", sig)
		w := httptest.NewRecorder()
		handler.HandleDelhiveryWebhook(w, req)

		if w.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 Bad Request for pickup order update via carrier webhook, got %d", w.Code)
		}
	})

	// 5. Valid forward progression succeeds
	t.Run("Valid forward transition paid -> shipped succeeds", func(t *testing.T) {
		body, _ := json.Marshal(map[string]interface{}{
			"order_id":        "ORD_DELIVERY_PAID",
			"status":          "In Transit",
			"tracking_number": "DEL123456789",
		})
		sig := computeSignature(body, secret)
		req := httptest.NewRequest("POST", "/api/delhivery/webhook", bytes.NewReader(body))
		req.Header.Set("X-Delhivery-Signature", sig)
		w := httptest.NewRecorder()
		handler.HandleDelhiveryWebhook(w, req)

		if w.Code != http.StatusOK {
			t.Fatalf("expected 200 OK, got %d: %s", w.Code, w.Body.String())
		}
		if mockRepo.orders["ORD_DELIVERY_PAID"].Status != "shipped" {
			t.Fatalf("expected status 'shipped', got %q", mockRepo.orders["ORD_DELIVERY_PAID"].Status)
		}
		body, _ = json.Marshal(map[string]string{"order_id": "ORD_DELIVERY_PAID", "status": "Delivered"})
		req = httptest.NewRequest(http.MethodPost, "/api/webhooks/delhivery", bytes.NewReader(body))
		req.Header.Set("X-Delhivery-Signature", computeSignature(body, secret))
		w = httptest.NewRecorder()
		handler.HandleDelhiveryWebhook(w, req)
		if w.Code != http.StatusOK || mockRepo.orders["ORD_DELIVERY_PAID"].TrackingNumber != "DEL123456789" {
			t.Fatalf("waybill should be retained after callback without tracking, got %d and %q", w.Code, mockRepo.orders["ORD_DELIVERY_PAID"].TrackingNumber)
		}
	})
}

func TestDelhiveryScanPushRecordsMatchingWaybill(t *testing.T) {
	const secret = "scan-push-test-token"
	order := &models.Order{ID: "ORD_TRACKING", Status: "shipped", CheckoutType: "delivery", TrackingNumber: "12345678901"}
	repo := &mockOrderRepoForWebhook{orders: map[string]*models.Order{order.ID: order}}
	carrier := service.NewDelhiveryService(secret, "", "mock")
	handler := NewOrderHandler(service.NewOrderService(repo, nil, nil, nil, carrier), nil, nil, carrier, nil)

	post := func(waybill, token string) *httptest.ResponseRecorder {
		t.Helper()
		body, err := json.Marshal(map[string]any{"Shipment": map[string]any{
			"AWB": waybill, "ReferenceNo": order.ID, "Status": map[string]string{
				"Status": "Out for Delivery", "StatusDateTime": "2026-11-22T11:30:00.125", "StatusLocation": "Hyderabad",
			},
		}})
		if err != nil {
			t.Fatal(err)
		}
		req := httptest.NewRequest(http.MethodPost, "/api/webhooks/delhivery", bytes.NewReader(body))
		req.Header.Set("X-Delhivery-Token", token)
		w := httptest.NewRecorder()
		handler.HandleDelhiveryWebhook(w, req)
		return w
	}

	if res := post(order.TrackingNumber, ""); res.Code != http.StatusUnauthorized {
		t.Fatalf("unauthenticated scan returned %d: %s", res.Code, res.Body)
	}
	if res := post("12345678902", secret); res.Code != http.StatusConflict || len(order.TrackingEvents) != 0 {
		t.Fatalf("mismatched waybill was accepted: %d", res.Code)
	}
	if res := post(order.TrackingNumber, secret); res.Code != http.StatusOK {
		t.Fatalf("matching scan returned %d: %s", res.Code, res.Body)
	}
	if len(order.TrackingEvents) != 1 || order.TrackingEvents[0].Status != "out_for_delivery" || order.Status != "shipped" {
		t.Fatalf("unexpected shipment event or order status: %+v", order)
	}
}
