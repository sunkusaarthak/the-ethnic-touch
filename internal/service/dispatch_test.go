package service

import (
	"context"
	"errors"
	"sync"
	"testing"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

type mockOrderRepoForDispatch struct {
	repository.OrderRepository
	mu      sync.Mutex
	orders  map[string]*models.Order
	saveErr error
}

func (m *mockOrderRepoForDispatch) GetOrder(orderID string) (*models.Order, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.orders[orderID], nil
}
func (m *mockOrderRepoForDispatch) GetOrderByRazorpayID(string) (*models.Order, error) {
	return nil, nil
}
func (m *mockOrderRepoForDispatch) GetAllOrders(string) ([]models.Order, error)   { return nil, nil }
func (m *mockOrderRepoForDispatch) GetAdminOrders(string) ([]models.Order, error) { return nil, nil }
func (m *mockOrderRepoForDispatch) GetPendingDeliveryOrders() ([]models.Order, error) {
	return nil, nil
}
func (m *mockOrderRepoForDispatch) CreateOrderWithTransaction(*models.Order, map[string]int, string) error {
	return nil
}
func (m *mockOrderRepoForDispatch) RecordCapturedPayment(string, string) (string, bool, error) {
	return "", false, nil
}
func (m *mockOrderRepoForDispatch) SaveOrderGift(string, string, *models.Coupon) (string, error) {
	return "", nil
}
func (m *mockOrderRepoForDispatch) ConfirmStorePickup(string) error                    { return nil }
func (m *mockOrderRepoForDispatch) CancelPendingOrder(string) error                    { return nil }
func (m *mockOrderRepoForDispatch) ConfirmPreorderPickup(string, string, string) error { return nil }
func (m *mockOrderRepoForDispatch) MarkPreorderPickupReady(string) error               { return nil }
func (m *mockOrderRepoForDispatch) MarkAllPreorderPickupReady() (int, error)           { return 0, nil }
func (m *mockOrderRepoForDispatch) GetPreorderPickupOrders(string) ([]models.Order, error) {
	return nil, nil
}
func (m *mockOrderRepoForDispatch) GetPreorderPickupAudit(string) ([]models.PreorderPickupAuditEntry, error) {
	return nil, nil
}
func (m *mockOrderRepoForDispatch) MarkPickupNotificationSent(string) error { return nil }

func (m *mockOrderRepoForDispatch) ClaimPendingDeliveryOrders(limit int, orderID string) ([]models.Order, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	var claimed []models.Order
	for _, o := range m.orders {
		if o.Status == "paid" && o.TrackingNumber == "" && (o.CheckoutType == "delivery" || o.CheckoutType == "hyderabad_instant") &&
			((orderID == "" && o.FulfilmentType == "") || orderID == o.ID) {
			o.Status = "dispatching"
			started := time.Now()
			o.DispatchStartedAt = &started
			claimed = append(claimed, *o)
			if len(claimed) >= limit {
				break
			}
		}
	}
	return claimed, nil
}

func (m *mockOrderRepoForDispatch) FinishDeliveryDispatch(orderID string, startedAt *time.Time, status, tracking, reason string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if m.saveErr != nil {
		return m.saveErr
	}
	if o, ok := m.orders[orderID]; ok {
		o.Status = status
		o.TrackingNumber = tracking
		o.DispatchError = reason
	}
	return nil
}

type mockDelhiveryServiceForDispatch struct {
	batchPickupFunc func(orders []models.Order) (map[string]ShipmentBookingResult, error)
}

func (m *mockDelhiveryServiceForDispatch) CheckServiceability(string, int) (bool, float64, error) {
	return true, 59.0, nil
}
func (m *mockDelhiveryServiceForDispatch) BatchPickup(orders []models.Order) (map[string]ShipmentBookingResult, error) {
	return m.batchPickupFunc(orders)
}
func (m *mockDelhiveryServiceForDispatch) ValidateWebhookSignature([]byte, string) bool { return true }
func (m *mockDelhiveryServiceForDispatch) ValidateWebhookToken(string) bool             { return true }
func (m *mockDelhiveryServiceForDispatch) FetchTracking(context.Context, []string) (map[string][]models.ShipmentEvent, error) {
	return nil, nil
}

func TestDispatch_IdempotencyAndReconciliation(t *testing.T) {
	t.Run("Mixed carrier acceptance: booked orders marked shipped, rejected preserved paid", func(t *testing.T) {
		repo := &mockOrderRepoForDispatch{
			orders: map[string]*models.Order{
				"ORD_OK": {
					ID:           "ORD_OK",
					Status:       "paid",
					CheckoutType: "delivery",
				},
				"ORD_REJECTED": {
					ID:           "ORD_REJECTED",
					Status:       "paid",
					CheckoutType: "delivery",
				},
			},
		}

		dlvSvc := &mockDelhiveryServiceForDispatch{
			batchPickupFunc: func(orders []models.Order) (map[string]ShipmentBookingResult, error) {
				return map[string]ShipmentBookingResult{
					"ORD_OK": {
						Success:        true,
						TrackingNumber: "WAYBILL_123456",
					},
					"ORD_REJECTED": {
						Rejected: true,
						Remarks:  "Pincode unserviceable",
					},
				}, nil
			},
		}

		svc := NewOrderService(repo, nil, nil, nil, dlvSvc)
		dispatched, failed, err := svc.DispatchPendingOrders("")
		if err != nil {
			t.Fatalf("unexpected dispatch error: %v", err)
		}
		if dispatched != 1 || failed != 1 {
			t.Fatalf("expected 1 dispatched and 1 failed, got dispatched=%d failed=%d", dispatched, failed)
		}

		if repo.orders["ORD_OK"].Status != "shipped" || repo.orders["ORD_OK"].TrackingNumber != "WAYBILL_123456" {
			t.Errorf("expected ORD_OK to be shipped with WAYBILL_123456, got: status=%s tracking=%s",
				repo.orders["ORD_OK"].Status, repo.orders["ORD_OK"].TrackingNumber)
		}

		if repo.orders["ORD_REJECTED"].Status != "paid" {
			t.Errorf("expected ORD_REJECTED to stay in paid state, got: %s", repo.orders["ORD_REJECTED"].Status)
		}
		if next, err := repo.ClaimPendingDeliveryOrders(50, ""); err != nil || len(next) != 1 || next[0].ID != "ORD_REJECTED" {
			t.Fatalf("expected rejected order to be claimable again, got %+v, %v", next, err)
		}
	})

	t.Run("Overlapping dispatches: concurrent runs do not duplicate bookings", func(t *testing.T) {
		repo := &mockOrderRepoForDispatch{
			orders: map[string]*models.Order{
				"ORD_CONCURRENT": {
					ID:           "ORD_CONCURRENT",
					Status:       "paid",
					CheckoutType: "delivery",
				},
			},
		}

		carrierCallCount := 0
		var carrierMu sync.Mutex
		dlvSvc := &mockDelhiveryServiceForDispatch{
			batchPickupFunc: func(orders []models.Order) (map[string]ShipmentBookingResult, error) {
				carrierMu.Lock()
				carrierCallCount += len(orders)
				carrierMu.Unlock()
				results := make(map[string]ShipmentBookingResult)
				for _, o := range orders {
					results[o.ID] = ShipmentBookingResult{Success: true, TrackingNumber: "WB_" + o.ID}
				}
				return results, nil
			},
		}

		svc := NewOrderService(repo, nil, nil, nil, dlvSvc)

		var wg sync.WaitGroup
		wg.Add(2)
		go func() {
			defer wg.Done()
			svc.DispatchPendingOrders("")
		}()
		go func() {
			defer wg.Done()
			svc.DispatchPendingOrders("")
		}()
		wg.Wait()

		// Exactly 1 order should have been booked across the concurrent attempts
		if carrierCallCount != 1 {
			t.Fatalf("expected exactly 1 carrier booking across concurrent dispatches, got %d", carrierCallCount)
		}
	})

	t.Run("Uncertain carrier booking requires verification before rebooking", func(t *testing.T) {
		repo := &mockOrderRepoForDispatch{
			orders: map[string]*models.Order{
				"ORD_NETWORK_ERR": {
					ID:           "ORD_NETWORK_ERR",
					Status:       "paid",
					CheckoutType: "delivery",
				},
			},
		}

		dlvSvc := &mockDelhiveryServiceForDispatch{
			batchPickupFunc: func(orders []models.Order) (map[string]ShipmentBookingResult, error) {
				return nil, errors.New("carrier gateway timeout 504")
			},
		}

		svc := NewOrderService(repo, nil, nil, nil, dlvSvc)
		_, _, err := svc.DispatchPendingOrders("")
		if err == nil {
			t.Fatalf("expected error from failed carrier call")
		}

		if repo.orders["ORD_NETWORK_ERR"].Status != "dispatch_review" {
			t.Fatalf("expected ambiguous booking to need review, got %q", repo.orders["ORD_NETWORK_ERR"].Status)
		}
		if dispatched, failed, err := svc.DispatchPendingOrders(""); dispatched != 0 || failed != 0 || err != nil {
			t.Fatalf("ambiguous booking should not retry automatically, got %d %d %v", dispatched, failed, err)
		}
	})

	t.Run("Accepted booking with failed database write is not counted or rebooked", func(t *testing.T) {
		saveErr := errors.New("database unavailable")
		repo := &mockOrderRepoForDispatch{orders: map[string]*models.Order{
			"pending": {ID: "pending", Status: "paid", CheckoutType: "delivery"},
		}, saveErr: saveErr}
		carrier := &mockDelhiveryServiceForDispatch{batchPickupFunc: func([]models.Order) (map[string]ShipmentBookingResult, error) {
			return map[string]ShipmentBookingResult{"pending": {Success: true, TrackingNumber: "1234"}}, nil
		}}
		svc := NewOrderService(repo, nil, nil, nil, carrier)
		if dispatched, failed, err := svc.DispatchPendingOrders(""); dispatched != 0 || failed != 1 || !errors.Is(err, saveErr) {
			t.Fatalf("expected failed save to be reported, got %d %d %v", dispatched, failed, err)
		}
		if dispatched, failed, err := svc.DispatchPendingOrders(""); dispatched != 0 || failed != 0 || err != nil {
			t.Fatalf("expected claim to block rebooking, got %d %d %v", dispatched, failed, err)
		}
	})

	t.Run("Missing live credentials leave orders eligible for dispatch", func(t *testing.T) {
		repo := &mockOrderRepoForDispatch{orders: map[string]*models.Order{
			"pending": {ID: "pending", Status: "paid", CheckoutType: "delivery"},
		}}
		carrier := NewDelhiveryService("", "", "delhivery")
		if usable, _, err := carrier.CheckServiceability("500081", 500); usable || !errors.Is(err, ErrCarrierNotConfigured) {
			t.Fatalf("missing live credentials should fail quotes, got %v %v", usable, err)
		}
		svc := NewOrderService(repo, nil, nil, nil, carrier)
		if dispatched, failed, err := svc.DispatchPendingOrders(""); dispatched != 0 || failed != 1 || !errors.Is(err, ErrCarrierNotConfigured) {
			t.Fatalf("missing live credentials should fail dispatch, got %d %d %v", dispatched, failed, err)
		}
		if o := repo.orders["pending"]; o.Status != "paid" || o.TrackingNumber != "" {
			t.Fatalf("missing credentials changed order status or assigned tracking: %+v", o)
		}
	})

	t.Run("A paid home preorder dispatches when staff selects it", func(t *testing.T) {
		repo := &mockOrderRepoForDispatch{orders: map[string]*models.Order{
			"preorder": {ID: "preorder", Status: "paid", CheckoutType: "delivery", FulfilmentType: models.FulfilmentTypePreorderHomeDelivery},
		}}
		carrier := &mockDelhiveryServiceForDispatch{batchPickupFunc: func(orders []models.Order) (map[string]ShipmentBookingResult, error) {
			if len(orders) != 1 || orders[0].ID != "preorder" {
				t.Fatalf("expected only the selected preorder, got %+v", orders)
			}
			return map[string]ShipmentBookingResult{"preorder": {Success: true, TrackingNumber: "23456"}}, nil
		}}
		svc := NewOrderService(repo, nil, nil, nil, carrier)
		if dispatched, failed, err := svc.DispatchPendingOrders(""); dispatched != 0 || failed != 0 || err != nil {
			t.Fatalf("scheduled batch should leave preorders alone, got %d %d %v", dispatched, failed, err)
		}
		if dispatched, failed, err := svc.DispatchPendingOrders("preorder"); dispatched != 1 || failed != 0 || err != nil {
			t.Fatalf("staff should be able to dispatch the selected preorder, got %d %d %v", dispatched, failed, err)
		}
	})
}
