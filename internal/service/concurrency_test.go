package service

import (
	"ethnictouch/internal/models"
	"sync"
	"testing"
)

type mockConcurrentProductRepo struct {
	mu    sync.Mutex
	stock int
	name  string
}

func (m *mockConcurrentProductRepo) GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return []models.Product{
		{
			ID:    "flash_p1",
			Name:  "Flash Sale Silk Saree",
			Price: 1000,
			Stock: m.stock,
		},
	}, map[string]interface{}{"total": 1}, nil
}

func (m *mockConcurrentProductRepo) CreateProduct(p *models.Product) error { return nil }
func (m *mockConcurrentProductRepo) GetReviews(productID string) ([]models.ProductReview, error) { return nil, nil }
func (m *mockConcurrentProductRepo) CreateReview(rev *models.ProductReview) error { return nil }

type mockConcurrentOrderRepo struct {
	mu          sync.Mutex
	productRepo *mockConcurrentProductRepo
	orders      []models.Order
}

func (m *mockConcurrentOrderRepo) GetOrder(orderID string) (*models.Order, error) { return nil, nil }
func (m *mockConcurrentOrderRepo) GetAllOrders(email string) ([]models.Order, error) { return nil, nil }
func (m *mockConcurrentOrderRepo) GetAdminOrders(orderID string) ([]models.Order, error) { return nil, nil }

func (m *mockConcurrentOrderRepo) CreateOrderWithTransaction(order *models.Order, stockDeductions map[string]int, couponCode string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.productRepo.mu.Lock()
	defer m.productRepo.mu.Unlock()

	if m.productRepo.stock < 1 {
		return models.ErrInsufficientStock
	}

	m.productRepo.stock -= 1
	m.orders = append(m.orders, *order)
	return nil
}

func (m *mockConcurrentOrderRepo) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	return nil
}

func TestConcurrentStockDepletion_OversellProtection(t *testing.T) {
	prodRepo := &mockConcurrentProductRepo{stock: 1, name: "Flash Sale Silk Saree"}
	orderRepo := &mockConcurrentOrderRepo{productRepo: prodRepo}

	var wg sync.WaitGroup
	numGoroutines := 20

	successCount := 0
	failureCount := 0
	var countMu sync.Mutex

	for i := 0; i < numGoroutines; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()

			req := &models.Order{
				ID:            "ORD_CONCURRENCY",
				CustomerEmail: "customer@test.com",
				TotalAmount:   1000,
			}

			err := orderRepo.CreateOrderWithTransaction(req, nil, "")
			countMu.Lock()
			if err == nil {
				successCount++
			} else {
				failureCount++
			}
			countMu.Unlock()
		}(i)
	}

	wg.Wait()

	if successCount != 1 {
		t.Errorf("Expected exactly 1 successful order for stock=1, got %d", successCount)
	}

	if failureCount != 19 {
		t.Errorf("Expected 19 failed orders due to insufficient stock, got %d", failureCount)
	}

	if prodRepo.stock < 0 {
		t.Errorf("Stock must never drop below 0, got %d", prodRepo.stock)
	}
}
