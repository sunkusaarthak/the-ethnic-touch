package repository

import (
	"database/sql"
	"fmt"
	"strings"
	"time"

	"ethnictouch/internal/models"
)

type CouponRepository interface {
	GetByCode(code string) (*models.Coupon, error)
	GetAllCoupons() ([]models.Coupon, error)
	CreateCoupon(c *models.Coupon) error
	DeleteCoupon(code string) error
	IncrementUsage(code string) error
	GetGiftTiers() ([]models.GiftTier, error)
	SaveGiftTiers(tiers []models.GiftTier) error
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
		SELECT id, code, type, value, min_order, COALESCE(expiry_date, ''), is_active, usage_limit, used_count, COALESCE(user_id, '')
		FROM coupons WHERE UPPER(TRIM(code)) = UPPER(TRIM($1)) AND is_active = TRUE`, code).
		Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.ExpiryDate, &c.IsActive, &c.UsageLimit, &c.UsedCount, &c.UserID)
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *postgresCouponRepo) GetAllCoupons() ([]models.Coupon, error) {
	rows, err := r.db.Query(`
		SELECT id, code, type, value, min_order, COALESCE(expiry_date, ''), is_active, usage_limit, used_count, COALESCE(user_id, '')
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
	code := strings.ToUpper(strings.TrimSpace(c.Code))
	if code == "" {
		return fmt.Errorf("coupon code cannot be empty")
	}
	c.Code = code

	if c.ID == "" {
		c.ID = fmt.Sprintf("cp_%d", time.Now().UnixNano())
	}
	if c.Type == "" {
		c.Type = "percentage"
	}

	_, err := r.db.Exec(`
		INSERT INTO coupons (id, code, type, value, min_order, expiry_date, is_active, usage_limit, used_count, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		ON CONFLICT (code) DO UPDATE SET
			type = EXCLUDED.type,
			value = EXCLUDED.value,
			min_order = EXCLUDED.min_order,
			expiry_date = EXCLUDED.expiry_date,
			is_active = EXCLUDED.is_active,
			usage_limit = EXCLUDED.usage_limit`,
		c.ID, c.Code, c.Type, c.Value, c.MinOrder, c.ExpiryDate, c.IsActive, c.UsageLimit, c.UsedCount, c.UserID)
	return err
}

func (r *postgresCouponRepo) DeleteCoupon(code string) error {
	_, err := r.db.Exec(`DELETE FROM coupons WHERE UPPER(TRIM(code)) = UPPER(TRIM($1))`, code)
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

func (r *postgresCouponRepo) SaveGiftTiers(tiers []models.GiftTier) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if _, err := tx.Exec("DELETE FROM gift_tiers"); err != nil {
		return err
	}

	stmt, err := tx.Prepare(`
		INSERT INTO gift_tiers (name, threshold, reward_type, discount_type, discount_value, coupon_format, physical_name, coupon_expiry_days)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, t := range tiers {
		expiry := t.CouponExpiryDays
		if expiry <= 0 {
			expiry = 30
		}
		if _, err := stmt.Exec(t.Name, t.Threshold, t.RewardType, t.DiscountType, t.DiscountValue, t.CouponFormat, t.PhysicalName, expiry); err != nil {
			return err
		}
	}

	return tx.Commit()
}
