package repository

import (
	"database/sql"

	"ethnictouch/internal/models"
)

type OrderRepository interface {
	GetOrder(orderID string) (*models.Order, error)
	GetAllOrders(email string) ([]models.Order, error)
	GetAdminOrders(orderID string) ([]models.Order, error)
	CreateOrderWithTransaction(order *models.Order, stockUpdates map[string]int, couponCode string) error
	UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error
}

type postgresOrderRepo struct {
	db *sql.DB
}

func NewOrderRepository(db *sql.DB) OrderRepository {
	return &postgresOrderRepo{db: db}
}

func (r *postgresOrderRepo) GetOrder(orderID string) (*models.Order, error) {
	var o models.Order
	err := r.db.QueryRow(`
		SELECT id, customer_email, total_amount, discount_amt, coupon_code, status, created_at, 
		COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''), 
		COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, ''),
		COALESCE(shipping_name, ''), COALESCE(shipping_phone, ''), COALESCE(shipping_address, ''),
		COALESCE(shipping_city, ''), COALESCE(shipping_state, ''), COALESCE(shipping_zip_code, ''),
		COALESCE(checkout_type, 'delivery'), COALESCE(payment_method, 'online') 
		FROM orders WHERE id = $1`, orderID).
		Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt,
			&o.RazorpayOrderID, &o.RazorpayPaymentID, &o.TrackingNumber, &o.ShippedAt, &o.UnlockedGift,
			&o.ShippingName, &o.ShippingPhone, &o.ShippingAddress, &o.ShippingCity, &o.ShippingState, &o.ShippingZIPCode,
			&o.CheckoutType, &o.PaymentMethod)
	
	if err != nil {
		return nil, err
	}
	return &o, nil
}

func (r *postgresOrderRepo) GetAllOrders(email string) ([]models.Order, error) {
	// Implementation matches original profileOrdersHandler logic
	return nil, nil // placeholder for brevity in implementation plan phase
}

func (r *postgresOrderRepo) GetAdminOrders(orderID string) ([]models.Order, error) {
	return nil, nil
}

func (r *postgresOrderRepo) CreateOrderWithTransaction(order *models.Order, stockUpdates map[string]int, couponCode string) error {
	return nil
}

func (r *postgresOrderRepo) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	return nil
}
