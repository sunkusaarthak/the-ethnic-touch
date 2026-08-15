package service

import (
	"ethnictouch/internal/models"
	"strings"
	"testing"
)

type mockCouponRepo struct {
	coupons map[string]*models.Coupon
	tiers   []models.GiftTier
}

func newMockCouponRepo() *mockCouponRepo {
	return &mockCouponRepo{
		coupons: map[string]*models.Coupon{
			"FESTIVE20": {
				ID:         "c1",
				Code:       "FESTIVE20",
				Type:       "percentage",
				Value:      20.0,
				MinOrder:   2000.0,
				IsActive:   true,
				UsageLimit: 10,
				UsedCount:  0,
			},
			"EXPIRED10": {
				ID:         "c2",
				Code:       "EXPIRED10",
				Type:       "fixed",
				Value:      100.0,
				MinOrder:   500.0,
				ExpiryDate: "2020-01-01T00:00:00Z",
				IsActive:   false,
				UsageLimit: 10,
				UsedCount:  0,
			},
			"DEPLETED50": {
				ID:         "c3",
				Code:       "DEPLETED50",
				Type:       "fixed",
				Value:      500.0,
				MinOrder:   1000.0,
				IsActive:   true,
				UsageLimit: 5,
				UsedCount:  5,
			},
		},
	}
}

func (m *mockCouponRepo) GetByCode(code string) (*models.Coupon, error) {
	upper := strings.ToUpper(strings.TrimSpace(code))
	if c, ok := m.coupons[upper]; ok {
		return c, nil
	}
	return nil, models.ErrNotFound
}

func (m *mockCouponRepo) GetAllCoupons() ([]models.Coupon, error) {
	var list []models.Coupon
	for _, c := range m.coupons {
		list = append(list, *c)
	}
	return list, nil
}

func (m *mockCouponRepo) CreateCoupon(c *models.Coupon) error {
	m.coupons[c.Code] = c
	return nil
}

func (m *mockCouponRepo) IncrementUsage(code string) error {
	upper := strings.ToUpper(strings.TrimSpace(code))
	if c, ok := m.coupons[upper]; ok {
		c.UsedCount++
	}
	return nil
}

func (m *mockCouponRepo) GetGiftTiers() ([]models.GiftTier, error) {
	return m.tiers, nil
}

func TestCouponService_ValidateCoupon(t *testing.T) {
	repo := newMockCouponRepo()
	svc := NewCouponService(repo)

	t.Run("Valid Percentage Coupon (Case Insensitive)", func(t *testing.T) {
		c, discount, err := svc.ValidateCoupon("festive20", 2500.0, nil)
		if err != nil {
			t.Fatalf("Expected valid coupon, got error: %v", err)
		}
		if c.Code != "FESTIVE20" {
			t.Errorf("Expected code FESTIVE20, got %s", c.Code)
		}
		if discount != 500.0 { // 20% of 2500 = 500
			t.Errorf("Expected discount 500.0, got %f", discount)
		}
	})

	t.Run("Minimum Order Requirement Not Met", func(t *testing.T) {
		_, _, err := svc.ValidateCoupon("FESTIVE20", 1999.99, nil)
		if err == nil {
			t.Errorf("Expected minimum order error for subtotal 1999.99, got nil")
		}
	})

	t.Run("Usage Limit Depleted Coupon", func(t *testing.T) {
		_, _, err := svc.ValidateCoupon("DEPLETED50", 1500.0, nil)
		if err == nil {
			t.Errorf("Expected usage limit error for DEPLETED50, got nil")
		}
	})
}
