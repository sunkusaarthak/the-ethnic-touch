package repository

import (
	"ethnictouch/internal/models"
	"testing"
)

func TestCartItemResponseStruct(t *testing.T) {
	item := CartItemResponse{
		ID:       "p101",
		Quantity: 2,
		Size:     "M",
		Price:    4999.00,
	}

	if item.ID != "p101" {
		t.Errorf("Expected ID p101, got %s", item.ID)
	}

	if item.Quantity != 2 {
		t.Errorf("Expected Quantity 2, got %d", item.Quantity)
	}
}

func TestProductModelsInRepository(t *testing.T) {
	p := models.Product{
		ID:    "prod_1",
		Name:  "Anarkali Suit",
		Price: 8999.0,
	}

	if p.Price != 8999.0 {
		t.Errorf("Expected price 8999.0, got %f", p.Price)
	}
}
