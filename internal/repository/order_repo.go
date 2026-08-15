package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"ethnictouch/internal/models"
)

type OrderRepository interface {
	GetOrder(orderID string) (*models.Order, error)
	GetAllOrders(email string) ([]models.Order, error)
	GetAdminOrders(orderID string) ([]models.Order, error)
	CreateOrderWithTransaction(order *models.Order, stockDeductions map[string]int, couponCode string) error
	UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error
	ConfirmStorePickup(orderID string) error
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

	items, err := r.getOrderItems(orderID)
	if err == nil {
		o.Items = items
	}

	return &o, nil
}

func (r *postgresOrderRepo) getOrderItems(orderID string) ([]models.OrderItem, error) {
	rows, err := r.db.Query(`
		SELECT COALESCE(oi.product_id, ''), oi.quantity, oi.price_at_qty, COALESCE(p.name, ''), COALESCE(oi.size, '')
		FROM order_items oi
		LEFT JOIN products p ON oi.product_id = p.id
		WHERE oi.order_id = $1`, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []models.OrderItem
	for rows.Next() {
		var it models.OrderItem
		if err := rows.Scan(&it.ProductID, &it.Quantity, &it.PriceAtQty, &it.ProductName, &it.Size); err == nil {
			items = append(items, it)
		}
	}
	return items, nil
}

func (r *postgresOrderRepo) ConfirmStorePickup(orderID string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start order transaction: %w", err)
	}
	defer tx.Rollback()

	// 1. Fetch order items
	rows, err := tx.Query(`SELECT product_id, quantity, COALESCE(size, '') FROM order_items WHERE order_id = $1`, orderID)
	if err != nil {
		return fmt.Errorf("failed to fetch order items: %w", err)
	}
	defer rows.Close()

	type itemData struct {
		ProductID string
		Quantity  int
		Size      string
	}
	var items []itemData
	for rows.Next() {
		var it itemData
		if err := rows.Scan(&it.ProductID, &it.Quantity, &it.Size); err != nil {
			return err
		}
		items = append(items, it)
	}
	rows.Close()

	// 2. Lock and deduct stock
	for _, item := range items {
		var prodName string
		var totalStock int
		var sizesStockStr string

		err := tx.QueryRow("SELECT name, stock, COALESCE(sizes_stock, '{}') FROM products WHERE id = $1 FOR UPDATE", item.ProductID).
			Scan(&prodName, &totalStock, &sizesStockStr)
		if err != nil {
			return fmt.Errorf("failed to lock product %s: %w", item.ProductID, err)
		}

		var sizesStock map[string]int
		json.Unmarshal([]byte(sizesStockStr), &sizesStock)
		if sizesStock == nil {
			sizesStock = map[string]int{}
		}

		if item.Size != "" && len(sizesStock) > 0 {
			if curr, ok := sizesStock[item.Size]; ok {
				if curr < item.Quantity {
					return fmt.Errorf("insufficient stock for product %s size %s. Online stock ran out before pickup.", prodName, item.Size)
				}
				sizesStock[item.Size] = curr - item.Quantity
			}
		}

		newTotalStock := totalStock - item.Quantity
		if newTotalStock < 0 {
			return fmt.Errorf("insufficient stock for product %s. Online stock ran out before pickup.", prodName)
		}

		sizesStockBytes, _ := json.Marshal(sizesStock)
		_, err = tx.Exec("UPDATE products SET stock = $1, sizes_stock = $2 WHERE id = $3", newTotalStock, string(sizesStockBytes), item.ProductID)
		if err != nil {
			return fmt.Errorf("failed to update stock for product %s: %w", item.ProductID, err)
		}
	}

	// 3. Update order status
	_, err = tx.Exec("UPDATE orders SET status = 'picked_up' WHERE id = $1", orderID)
	if err != nil {
		return fmt.Errorf("failed to update order status: %w", err)
	}

	return tx.Commit()
}

func (r *postgresOrderRepo) GetAllOrders(email string) ([]models.Order, error) {
	var rows *sql.Rows
	var err error

	if email != "" {
		rows, err = r.db.Query(`
			SELECT id, customer_email, total_amount, discount_amt, coupon_code, status, created_at,
			COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''),
			COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, ''),
			COALESCE(shipping_name, ''), COALESCE(shipping_phone, ''), COALESCE(shipping_address, ''),
			COALESCE(shipping_city, ''), COALESCE(shipping_state, ''), COALESCE(shipping_zip_code, ''),
			COALESCE(checkout_type, 'delivery'), COALESCE(payment_method, 'online')
			FROM orders WHERE LOWER(customer_email) = LOWER($1) ORDER BY created_at DESC`, email)
	} else {
		rows, err = r.db.Query(`
			SELECT id, customer_email, total_amount, discount_amt, coupon_code, status, created_at,
			COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''),
			COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, ''),
			COALESCE(shipping_name, ''), COALESCE(shipping_phone, ''), COALESCE(shipping_address, ''),
			COALESCE(shipping_city, ''), COALESCE(shipping_state, ''), COALESCE(shipping_zip_code, ''),
			COALESCE(checkout_type, 'delivery'), COALESCE(payment_method, 'online')
			FROM orders ORDER BY created_at DESC`)
	}

	if err != nil {
		return nil, err
	}

	var orders []models.Order
	for rows.Next() {
		var o models.Order
		err := rows.Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt,
			&o.RazorpayOrderID, &o.RazorpayPaymentID, &o.TrackingNumber, &o.ShippedAt, &o.UnlockedGift,
			&o.ShippingName, &o.ShippingPhone, &o.ShippingAddress, &o.ShippingCity, &o.ShippingState, &o.ShippingZIPCode,
			&o.CheckoutType, &o.PaymentMethod)
		if err == nil {
			orders = append(orders, o)
		}
	}
	rows.Close()

	// Safely fetch items for each order after main connection rows are closed
	for i := range orders {
		items, _ := r.getOrderItems(orders[i].ID)
		orders[i].Items = items
	}

	return orders, nil
}

func (r *postgresOrderRepo) GetAdminOrders(orderID string) ([]models.Order, error) {
	if orderID != "" {
		o, err := r.GetOrder(orderID)
		if err != nil {
			return nil, err
		}
		return []models.Order{*o}, nil
	}
	return r.GetAllOrders("")
}

func (r *postgresOrderRepo) CreateOrderWithTransaction(order *models.Order, stockDeductions map[string]int, couponCode string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start order transaction: %w", err)
	}
	defer tx.Rollback()

	// 1. Lock and update product stocks (SKIP for pending store pickups)
	isPendingPickup := order.CheckoutType == "pickup" && order.PaymentMethod == "offline_qr" && order.Status == "pending_payment"
	
	if !isPendingPickup {
		for _, item := range order.Items {
			var prodName string
			var totalStock int
			var sizesStockStr string

			err := tx.QueryRow("SELECT name, stock, COALESCE(sizes_stock, '{}') FROM products WHERE id = $1 FOR UPDATE", item.ProductID).
				Scan(&prodName, &totalStock, &sizesStockStr)
			if err != nil {
				return fmt.Errorf("failed to lock product %s: %w", item.ProductID, err)
			}

			var sizesStock map[string]int
			json.Unmarshal([]byte(sizesStockStr), &sizesStock)
			if sizesStock == nil {
				sizesStock = map[string]int{}
			}

			if item.Size != "" && len(sizesStock) > 0 {
				if curr, ok := sizesStock[item.Size]; ok {
					if curr < item.Quantity {
						return fmt.Errorf("insufficient stock for product %s size %s", prodName, item.Size)
					}
					sizesStock[item.Size] = curr - item.Quantity
				}
			}

			newTotalStock := totalStock - item.Quantity
			if newTotalStock < 0 {
				newTotalStock = 0
			}

			sizesStockBytes, _ := json.Marshal(sizesStock)
			_, err = tx.Exec("UPDATE products SET stock = $1, sizes_stock = $2 WHERE id = $3", newTotalStock, string(sizesStockBytes), item.ProductID)
			if err != nil {
				return fmt.Errorf("failed to update stock for product %s: %w", item.ProductID, err)
			}
		}
	}

	// 2. Increment coupon usage count if applied
	if couponCode != "" {
		trimmedCode := strings.TrimSpace(couponCode)
		_, err = tx.Exec("UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(TRIM(code)) = UPPER(TRIM($1))", trimmedCode)
		if err != nil {
			return fmt.Errorf("failed to update coupon usage: %w", err)
		}
	}

	// 3. Insert order record
	createdAt := time.Now().Format(time.RFC3339)
	if order.CreatedAt != "" {
		createdAt = order.CreatedAt
	}

	_, err = tx.Exec(`INSERT INTO orders (id, customer_email, total_amount, discount_amt, coupon_code, status, created_at, razorpay_order_id, razorpay_payment_id,
		shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip_code, checkout_type, payment_method)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
		order.ID, order.CustomerEmail, order.TotalAmount, order.DiscountAmt, order.CouponCode, order.Status, createdAt,
		order.RazorpayOrderID, order.RazorpayPaymentID, order.ShippingName, order.ShippingPhone, order.ShippingAddress,
		order.ShippingCity, order.ShippingState, order.ShippingZIPCode, order.CheckoutType, order.PaymentMethod)
	if err != nil {
		return fmt.Errorf("failed to insert order: %w", err)
	}

	// 4. Insert order items
	for _, item := range order.Items {
		_, err = tx.Exec("INSERT INTO order_items (order_id, product_id, quantity, price_at_qty, size) VALUES ($1, $2, $3, $4, $5)",
			order.ID, item.ProductID, item.Quantity, item.PriceAtQty, item.Size)
		if err != nil {
			return fmt.Errorf("failed to insert order item: %w", err)
		}
	}

	return tx.Commit()
}

func (r *postgresOrderRepo) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := "UPDATE orders SET status = $1"
	args := []interface{}{status}
	argIdx := 2

	if paymentID != "" {
		query += fmt.Sprintf(", razorpay_payment_id = $%d", argIdx)
		args = append(args, paymentID)
		argIdx++
	}
	if tracking != "" {
		query += fmt.Sprintf(", tracking_number = $%d", argIdx)
		args = append(args, tracking)
		argIdx++
	}
	if shippedAt != "" {
		query += fmt.Sprintf(", shipped_at = $%d", argIdx)
		args = append(args, shippedAt)
		argIdx++
	}
	if unlockedGift != "" {
		query += fmt.Sprintf(", unlocked_gift = $%d", argIdx)
		args = append(args, unlockedGift)
		argIdx++
	}

	query += fmt.Sprintf(" WHERE id = $%d", argIdx)
	args = append(args, orderID)

	_, err = tx.Exec(query, args...)
	if err != nil {
		return err
	}

	return tx.Commit()
}
