package service

import (
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
	"testing"
)

type mockCartRepo struct {
	cartItems map[string][]repository.CartItemResponse
	wishlist  map[string][]models.Product
}

func newMockCartRepo() *mockCartRepo {
	return &mockCartRepo{
		cartItems: make(map[string][]repository.CartItemResponse),
		wishlist:  make(map[string][]models.Product),
	}
}

func (m *mockCartRepo) GetCart(userID string) ([]repository.CartItemResponse, error) {
	return m.cartItems[userID], nil
}

func (m *mockCartRepo) AddToCart(userID, productID string, quantity int, size string) error {
	items := m.cartItems[userID]
	found := false
	for i, item := range items {
		if item.ID == productID && item.Size == size {
			items[i].Quantity += quantity
			found = true
			break
		}
	}
	if !found {
		items = append(items, repository.CartItemResponse{
			ID:       productID,
			Quantity: quantity,
			Size:     size,
		})
	}
	m.cartItems[userID] = items
	return nil
}

func (m *mockCartRepo) RemoveFromCart(userID, productID, size string) error {
	items := m.cartItems[userID]
	var updated []repository.CartItemResponse
	for _, item := range items {
		if !(item.ID == productID && item.Size == size) {
			updated = append(updated, item)
		}
	}
	m.cartItems[userID] = updated
	return nil
}

func (m *mockCartRepo) ClearCart(userID string) error {
	delete(m.cartItems, userID)
	return nil
}

func (m *mockCartRepo) GetWishlist(userID string) ([]models.Product, error) {
	return m.wishlist[userID], nil
}

func (m *mockCartRepo) AddToWishlist(userID, productID string) error {
	m.wishlist[userID] = append(m.wishlist[userID], models.Product{ID: productID})
	return nil
}

func (m *mockCartRepo) RemoveFromWishlist(userID, productID string) error {
	items := m.wishlist[userID]
	var updated []models.Product
	for _, item := range items {
		if item.ID != productID {
			updated = append(updated, item)
		}
	}
	m.wishlist[userID] = updated
	return nil
}

func (m *mockCartRepo) MergeWishlist(userID string, productIDs []string) error {
	for _, pid := range productIDs {
		m.wishlist[userID] = append(m.wishlist[userID], models.Product{ID: pid})
	}
	return nil
}

func TestCartService_SingleDistinctItemAndAggregation(t *testing.T) {
	repo := newMockCartRepo()
	svc := NewCartService(repo)
	userID := "user_test_101"

	t.Run("Single Distinct Item Invariant and Quantity Aggregation", func(t *testing.T) {
		// Add P1 Size M with Qty 2
		err := svc.AddToCart(userID, "p1", 2, "M")
		if err != nil {
			t.Fatalf("Failed to add to cart: %v", err)
		}

		// Add P1 Size M again with Qty 3
		err = svc.AddToCart(userID, "p1", 3, "M")
		if err != nil {
			t.Fatalf("Failed to aggregate cart item: %v", err)
		}

		items, _ := svc.GetCart(userID)

		// Invariant: Exactly 1 distinct item entry for (p1, M)
		if len(items) != 1 {
			t.Errorf("Expected strictly 1 cart item entry for (p1, M), got %d", len(items))
		}

		// Invariant: Aggregated quantity equals 5
		if items[0].Quantity != 5 {
			t.Errorf("Expected aggregated quantity 5, got %d", items[0].Quantity)
		}
	})

	t.Run("Size Variant Separation", func(t *testing.T) {
		// Add P1 Size L with Qty 1
		svc.AddToCart(userID, "p1", 1, "L")

		items, _ := svc.GetCart(userID)

		// Size M and Size L must remain 2 distinct items
		if len(items) != 2 {
			t.Errorf("Expected 2 distinct size variant items (M and L), got %d", len(items))
		}
	})
}
