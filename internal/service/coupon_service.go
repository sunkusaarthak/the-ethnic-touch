package service

import (
	"errors"
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

type CouponService interface {
	ValidateCoupon(code string, subtotal float64, items []models.CartItemInfo) (*models.Coupon, float64, error)
	GetAllCoupons() ([]models.Coupon, error)
	CreateCoupon(c *models.Coupon) error
	GetGiftTiers() ([]models.GiftTier, error)
}

type couponService struct {
	repo repository.CouponRepository
}

func NewCouponService(repo repository.CouponRepository) CouponService {
	return &couponService{repo: repo}
}

func (s *couponService) ValidateCoupon(code string, subtotal float64, items []models.CartItemInfo) (*models.Coupon, float64, error) {
	c, err := s.repo.GetByCode(code)
	if err != nil {
		return nil, 0, errors.New("invalid or expired coupon code")
	}

	if subtotal < c.MinOrder {
		return nil, 0, errors.New("minimum order amount not met for this coupon")
	}

	if c.UsageLimit > 0 && c.UsedCount >= c.UsageLimit {
		return nil, 0, errors.New("coupon usage limit has been reached")
	}

	var discountAmt float64
	if c.Type == "fixed" {
		discountAmt = c.Value
	} else if c.Type == "percentage" {
		if c.Value == 100.0 && len(code) >= 15 && code[:15] == "SPIN-FREEKURTHI" {
			// Find the cheapest item in the cart to make free
			minPrice := -1.0
			for _, item := range items {
				if minPrice == -1.0 || item.Price < minPrice {
					minPrice = item.Price
				}
			}
			if minPrice > 0 {
				discountAmt = minPrice
			} else {
				discountAmt = 0
			}
		} else if len(code) >= 11 && code[:11] == "SPIN-KURTHI" {
			// Apply percentage discount only to the cheapest item in the cart
			minPrice := -1.0
			for _, item := range items {
				if minPrice == -1.0 || item.Price < minPrice {
					minPrice = item.Price
				}
			}
			if minPrice > 0 {
				discountAmt = (minPrice * c.Value) / 100.0
			} else {
				discountAmt = 0
			}
		} else {
			discountAmt = (subtotal * c.Value) / 100.0
		}
	}

	if discountAmt > subtotal {
		discountAmt = subtotal
	}

	return c, discountAmt, nil
}

func (s *couponService) GetAllCoupons() ([]models.Coupon, error) {
	return s.repo.GetAllCoupons()
}

func (s *couponService) CreateCoupon(c *models.Coupon) error {
	return s.repo.CreateCoupon(c)
}

func (s *couponService) GetGiftTiers() ([]models.GiftTier, error) {
	return s.repo.GetGiftTiers()
}
