package repository

import (
	"database/sql"
	"ethnictouch/internal/models"
)

type CouponRepository interface {
	GetByCode(code string) (*models.Coupon, error)
	GetAllCoupons() ([]models.Coupon, error)
	CreateCoupon(c *models.Coupon) error
	IncrementUsage(code string) error
	GetGiftTiers() ([]models.GiftTier, error)
}

type postgresCouponRepo struct {
	db *sql.DB
}

func NewCouponRepository(db *sql.DB) CouponRepository {
	return &postgresCouponRepo{db: db}
}

func (r *postgresCouponRepo) GetByCode(code string) (*models.Coupon, error) {
	var c models.Coupon
	err := r.db.QueryRow(`
		SELECT id, code, type, value, min_order, COALESCE(expiry_date, ''), is_active, usage_limit, used_count, user_id
		FROM coupons WHERE UPPER(TRIM(code)) = UPPER(TRIM($1)) AND is_active = TRUE`, code).
		Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.ExpiryDate, &c.IsActive, &c.UsageLimit, &c.UsedCount, &c.UserID)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *postgresCouponRepo) GetAllCoupons() ([]models.Coupon, error) {
	rows, err := r.db.Query(`
		SELECT id, code, type, value, min_order, expiry_date, is_active, usage_limit, used_count, user_id
		FROM coupons ORDER BY id DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var coupons []models.Coupon
	for rows.Next() {
		var c models.Coupon
		if err := rows.Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.ExpiryDate, &c.IsActive, &c.UsageLimit, &c.UsedCount, &c.UserID); err == nil {
			coupons = append(coupons, c)
		}
	}
	return coupons, nil
}

func (r *postgresCouponRepo) CreateCoupon(c *models.Coupon) error {
	_, err := r.db.Exec(`
		INSERT INTO coupons (id, code, type, value, min_order, expiry_date, is_active, usage_limit, used_count, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		c.ID, c.Code, c.Type, c.Value, c.MinOrder, c.ExpiryDate, c.IsActive, c.UsageLimit, c.UsedCount, c.UserID)
	return err
}

func (r *postgresCouponRepo) IncrementUsage(code string) error {
	_, err := r.db.Exec(`UPDATE coupons SET used_count = used_count + 1 WHERE code = $1`, code)
	return err
}

func (r *postgresCouponRepo) GetGiftTiers() ([]models.GiftTier, error) {
	rows, err := r.db.Query(`
		SELECT id, name, threshold, reward_type, discount_type, discount_value, 
		COALESCE(coupon_format, ''), COALESCE(physical_name, ''), COALESCE(coupon_expiry_days, 30)
		FROM gift_tiers ORDER BY threshold ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tiers []models.GiftTier
	for rows.Next() {
		var t models.GiftTier
		if err := rows.Scan(&t.ID, &t.Name, &t.Threshold, &t.RewardType, &t.DiscountType, &t.DiscountValue, &t.CouponFormat, &t.PhysicalName, &t.CouponExpiryDays); err == nil {
			tiers = append(tiers, t)
		}
	}
	return tiers, nil
}
