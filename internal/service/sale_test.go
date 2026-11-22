package service

import (
	"testing"
	"time"

	"ethnictouch/internal/models"
)

func TestSaleScheduleAndEligibility(t *testing.T) {
	start := time.Date(2026, 11, 22, 14, 0, 0, 0, time.UTC)
	sale := models.Sale{Enabled: true, Percent: 15, StartsAt: start, EndsAt: start.Add(time.Hour), Collections: []string{"Workday"}}
	if sale.Active(start.Add(-time.Second)) || !sale.Active(start) || sale.Active(sale.EndsAt) {
		t.Fatal("wrong sale schedule boundaries")
	}
	product := models.Product{Price: 499.90, Collection: "workday"}
	if got := sale.UnitSavings(product); got != 7499 {
		t.Fatalf("got %d paise savings, want 7499", got)
	}
	product.IsPreorder = true
	if sale.UnitSavings(product) != 0 {
		t.Fatal("preorder received a discount")
	}
	product.IsPreorder, product.OriginalPrice = false, 599.0
	if sale.UnitSavings(product) != 0 {
		t.Fatal("already discounted product received a discount")
	}
}
