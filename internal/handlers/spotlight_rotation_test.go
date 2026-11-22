package handlers

import (
	"testing"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type spotlightCatalogStub struct{ service.ProductService }

func (spotlightCatalogStub) GetProducts(map[string]string) ([]models.Product, map[string]interface{}, error) {
	return []models.Product{
		{ID: "sold-out"},
		{ID: "kurti", Name: "Indigo Kurti", Description: "Indigo cotton", Price: 549,
			ImageURL: "/images/indigo.jpg", SizesStock: map[string]int{"M": 2}},
	}, nil, nil
}

func TestSpotlightReturnsMatchingCatalogDetails(t *testing.T) {
	handler := &ConfigHandler{flashCatalog: spotlightCatalogStub{}}
	config := models.FlashDropConfig{Mode: "random", ProductID: "sold-out", Highlight: "Old title"}
	handler.recalculateFlashDropTiming(&config)
	product := config.FeaturedProduct
	if config.FeaturedProductID != "kurti" || config.NextChangeAt == "" || product == nil ||
		product.ID != config.FeaturedProductID || product.Name != "Indigo Kurti" ||
		product.Description != "Indigo cotton" || product.Price != 549 || product.ImageURL != "/images/indigo.jpg" {
		t.Fatalf("Spotlight returned mismatched catalog data: %+v, %+v", config, product)
	}
}

func TestSpotlightRotation(t *testing.T) {
	const seed = "2026-11-22T12:00:00Z"
	first := rotatingSpotlight([]string{"kurti-a", "kurti-b", "kurti-c"}, seed, "", 0)
	if got := rotatingSpotlight([]string{"kurti-c", "kurti-a", "kurti-b"}, seed, "", 0); got != first {
		t.Fatalf("same cycle changed with catalog order: %q vs %q", first, got)
	}
	last := first
	for cycle := int64(1); cycle < 7; cycle++ {
		pick := rotatingSpotlight([]string{"kurti-a", "kurti-b", "kurti-c"}, seed, "", cycle)
		if pick == last {
			t.Fatalf("cycle %d repeated %q", cycle, pick)
		}
		last = pick
	}
	if got := rotatingSpotlight([]string{"kurti-a", "kurti-b", "kurti-c"}, seed, first, 0); got == first {
		t.Fatal("expired manual selection stayed featured")
	}
}
