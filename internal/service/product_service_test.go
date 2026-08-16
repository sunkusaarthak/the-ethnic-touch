package service

import (
	"ethnictouch/internal/models"
	"testing"
)

type mockProductRepo struct {
	products []models.Product
	reviews  map[string][]models.ProductReview
}

func (m *mockProductRepo) GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error) {
	var result []models.Product
	for _, p := range m.products {
		if idFilter, ok := filters["id"]; ok && idFilter != "" {
			if p.ID != idFilter {
				continue
			}
		}
		result = append(result, p)
	}
	return result, map[string]interface{}{"total": len(result)}, nil
}

func (m *mockProductRepo) CreateProduct(p *models.Product) error {
	m.products = append(m.products, *p)
	return nil
}

func (m *mockProductRepo) DeleteProduct(id string) error {
	return nil
}

func (m *mockProductRepo) UpdateProduct(p *models.Product) error {
	return nil
}

func (m *mockProductRepo) GetProductByID(id string) (*models.Product, error) {
	for _, p := range m.products {
		if p.ID == id {
			return &p, nil
		}
	}
	return nil, nil // return nil for brevity, or we'd need to import errors
}

func (m *mockProductRepo) GetReviews(productID string) ([]models.ProductReview, error) {
	return m.reviews[productID], nil
}

func (m *mockProductRepo) CreateReview(rev *models.ProductReview) error {
	if m.reviews == nil {
		m.reviews = make(map[string][]models.ProductReview)
	}
	m.reviews[rev.ProductID] = append(m.reviews[rev.ProductID], *rev)
	return nil
}

func TestProductService_CreateReview(t *testing.T) {
	repo := &mockProductRepo{reviews: make(map[string][]models.ProductReview)}
	svc := NewProductService(repo)

	t.Run("Valid Review Rating (1-5)", func(t *testing.T) {
		rev := &models.ProductReview{
			ProductID: "p1",
			UserName:  "Ananya",
			UserEmail: "ananya@test.com",
			Rating:    5,
			Comment:   "Beautiful Anarkali dress!",
		}
		err := svc.CreateReview(rev)
		if err != nil {
			t.Errorf("Expected nil error for valid review, got: %v", err)
		}
	})

	t.Run("Invalid Rating Below 1", func(t *testing.T) {
		rev := &models.ProductReview{
			ProductID: "p1",
			UserName:  "User",
			UserEmail: "user@test.com",
			Rating:    0,
			Comment:   "Bad rating",
		}
		err := svc.CreateReview(rev)
		if err == nil {
			t.Errorf("Expected error for rating 0, got nil")
		}
	})

	t.Run("Invalid Rating Above 5", func(t *testing.T) {
		rev := &models.ProductReview{
			ProductID: "p1",
			UserName:  "User",
			UserEmail: "user@test.com",
			Rating:    6,
			Comment:   "Rating too high",
		}
		err := svc.CreateReview(rev)
		if err == nil {
			t.Errorf("Expected error for rating 6, got nil")
		}
	})
}

func TestProductService_CreateProduct(t *testing.T) {
	repo := &mockProductRepo{}
	svc := NewProductService(repo)

	p := &models.Product{
		Name:     "Silk Saree",
		Price:    12000,
		Category: "Saree",
	}

	err := svc.CreateProduct(p)
	if err != nil {
		t.Fatalf("Failed to create product: %v", err)
	}

	if p.ID == "" {
		t.Errorf("Expected generated Product ID, got empty string")
	}

	if p.CreatedAt == "" {
		t.Errorf("Expected CreatedAt timestamp to be populated")
	}
}
