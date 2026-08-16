package handlers

import (
	"ethnictouch/internal/models"
	"net/http"
	"net/http/httptest"
	"testing"
)

type mockProductService struct {
	products []models.Product
}

func (m *mockProductService) GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error) {
	return m.products, map[string]interface{}{"total": len(m.products)}, nil
}

func (m *mockProductService) DeleteProduct(id string) error {
	return nil
}

func (m *mockProductService) UpdateProduct(p *models.Product) error {
	return nil
}

func (m *mockProductService) CreateProduct(p *models.Product) error {
	m.products = append(m.products, *p)
	return nil
}

func (m *mockProductService) GetProductByID(id string) (*models.Product, error) {
	for _, p := range m.products {
		if p.ID == id {
			return &p, nil
		}
	}
	return nil, nil // Return simple nil if not found for simplicity, or we would need to import errors
}

func (m *mockProductService) GetReviews(productID string) ([]models.ProductReview, error) {
	return nil, nil
}

func (m *mockProductService) CreateReview(rev *models.ProductReview) error {
	return nil
}

func TestProductHandler_HandleProducts_GET(t *testing.T) {
	mockSvc := &mockProductService{
		products: []models.Product{
			{ID: "p1", Name: "Silk Saree", Price: 12000, Category: "Saree"},
		},
	}

	handler := NewProductHandler(mockSvc)

	req := httptest.NewRequest("GET", "/api/products", nil)
	rr := httptest.NewRecorder()

	handler.HandleProducts(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Expected status 200 OK, got %d", rr.Code)
	}

	contentType := rr.Header().Get("Content-Type")
	if contentType != "application/json" {
		t.Errorf("Expected Content-Type application/json, got %s", contentType)
	}
}
