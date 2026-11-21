package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"ethnictouch/internal/models"
)

// Sentinel errors for preorder pickup operations.
var ErrAlreadyCollected = fmt.Errorf("order already marked as collected")
var ErrInvalidPreorderStatus = fmt.Errorf("invalid status transition for preorder order")

type OrderRepository interface {
	GetOrder(orderID string) (*models.Order, error)
	GetAllOrders(email string) ([]models.Order, error)
	GetAdminOrders(orderID string) ([]models.Order, error)
	GetPendingDeliveryOrders() ([]models.Order, error)
	CreateOrderWithTransaction(order *models.Order, stockDeductions map[string]int, couponCode string) error
	UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error
	UpdateOrderStatusWithGiftTransaction(orderID, status, paymentID, unlockedGift string, newCoupon *models.Coupon) error
	ConfirmStorePickup(orderID string) error
	CancelPendingOrder(orderID string) error
	// Preorder pickup methods
	ConfirmPreorderPickup(orderID, adminEmail, notes string) error
	MarkPreorderPickupReady(orderID string) error
	MarkAllPreorderPickupReady() (int, error)
	GetPreorderPickupOrders(filter string) ([]models.Order, error)
	GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error)
	MarkPickupNotificationSent(orderID string) error
}

type postgresOrderRepo struct {
	db *sql.DB
}

func NewOrderRepository(db *sql.DB) OrderRepository {
	return &postgresOrderRepo{db: db}
}

// orderColumns is the shared SELECT column list for orders.
const orderColumns = `id, customer_email, total_amount, discount_amt, coupon_code, status, created_at,
	COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''),
	COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, ''),
	COALESCE(shipping_name, ''), COALESCE(shipping_phone, ''), COALESCE(shipping_address, ''),
	COALESCE(shipping_city, ''), COALESCE(shipping_state, ''), COALESCE(shipping_zip_code, ''),
	COALESCE(checkout_type, 'delivery'), COALESCE(payment_method, 'online'),
	COALESCE(fulfilment_type, ''), COALESCE(pickup_location_snapshot, ''),
	COALESCE(pickup_collected_at, ''), COALESCE(pickup_collected_by, ''),
	COALESCE(pickup_notification_sent, FALSE)`

func scanOrder(scanner interface {
	Scan(dest ...interface{}) error
}) (models.Order, error) {
	var o models.Order
	err := scanner.Scan(
		&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt,
		&o.RazorpayOrderID, &o.RazorpayPaymentID, &o.TrackingNumber, &o.ShippedAt, &o.UnlockedGift,
		&o.ShippingName, &o.ShippingPhone, &o.ShippingAddress, &o.ShippingCity, &o.ShippingState, &o.ShippingZIPCode,
		&o.CheckoutType, &o.PaymentMethod,
		&o.FulfilmentType, &o.PickupLocationSnapshot,
		&o.PickupCollectedAt, &o.PickupCollectedBy, &o.PickupNotificationSent,
	)
	if err == nil {
		o.IsPreorder = o.FulfilmentType == models.FulfilmentTypePreorderStorePickup || o.FulfilmentType == models.FulfilmentTypePreorderHomeDelivery
	}
	return o, err
}

func (r *postgresOrderRepo) GetOrder(orderID string) (*models.Order, error) {
	row := r.db.QueryRow(`SELECT `+orderColumns+` FROM orders WHERE id = $1`, orderID)
	o, err := scanOrder(row)
	if err != nil {
		return nil, err
	}
	items, err := r.getOrderItems(orderID)
	if err == nil {
		o.Items = items
		for _, it := range items {
			if it.IsPreorder {
				o.IsPreorder = true
			}
		}
	}
	return &o, nil
}

func (r *postgresOrderRepo) getOrderItems(orderID string) ([]models.OrderItem, error) {
	rows, err := r.db.Query(`
		SELECT COALESCE(oi.product_id, ''), oi.quantity, oi.price_at_qty, COALESCE(p.name, ''), COALESCE(oi.size, ''), COALESCE(p.is_preorder, FALSE)
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
		if err := rows.Scan(&it.ProductID, &it.Quantity, &it.PriceAtQty, &it.ProductName, &it.Size, &it.IsPreorder); err == nil {
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
	var dbRows *sql.Rows
	var err error

	if email != "" {
		dbRows, err = r.db.Query(`SELECT `+orderColumns+`
			FROM orders WHERE LOWER(customer_email) = LOWER($1)
			AND (status NOT IN ('pending', 'cancelled', 'payment_failed') OR (checkout_type = 'pickup' AND payment_method = 'offline_qr' AND status = 'pending_payment'))
			ORDER BY created_at DESC`, email)
	} else {
		dbRows, err = r.db.Query(`SELECT ` + orderColumns + ` FROM orders ORDER BY created_at DESC`)
	}

	if err != nil {
		return nil, err
	}

	var orders []models.Order
	for dbRows.Next() {
		o, err := scanOrder(dbRows)
		if err == nil {
			orders = append(orders, o)
		}
	}
	dbRows.Close()

	for i := range orders {
		items, _ := r.getOrderItems(orders[i].ID)
		orders[i].Items = items
		for _, it := range items {
			if it.IsPreorder {
				orders[i].IsPreorder = true
			}
		}
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

	// 1. Lock and update product stocks (SKIP for pending store pickups and all preorder orders)
	isPendingPickup := (order.CheckoutType == "pickup" && order.PaymentMethod == "offline_qr" && order.Status == "pending_payment") ||
		order.FulfilmentType == models.FulfilmentTypePreorderStorePickup ||
		order.FulfilmentType == models.FulfilmentTypePreorderHomeDelivery ||
		order.IsPreorder

	if !isPendingPickup {
		for _, item := range order.Items {
			if item.IsPreorder {
				continue
			}
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

			if item.Size != "" {
				curr, ok := sizesStock[item.Size]
				if !ok || curr < item.Quantity {
					return fmt.Errorf("insufficient stock for product %s size %s", prodName, item.Size)
				}
				sizesStock[item.Size] = curr - item.Quantity
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

	_, err = tx.Exec(`INSERT INTO orders (id, customer_email, total_amount, discount_amt, coupon_code, status, created_at,
		razorpay_order_id, razorpay_payment_id,
		shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip_code,
		checkout_type, payment_method, fulfilment_type, pickup_location_snapshot)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
		order.ID, order.CustomerEmail, order.TotalAmount, order.DiscountAmt, order.CouponCode, order.Status, createdAt,
		order.RazorpayOrderID, order.RazorpayPaymentID, order.ShippingName, order.ShippingPhone, order.ShippingAddress,
		order.ShippingCity, order.ShippingState, order.ShippingZIPCode, order.CheckoutType, order.PaymentMethod,
		order.FulfilmentType, order.PickupLocationSnapshot)
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

func (r *postgresOrderRepo) UpdateOrderStatusWithGiftTransaction(orderID, status, paymentID, unlockedGift string, newCoupon *models.Coupon) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	if newCoupon != nil {
		_, err = tx.Exec(`INSERT INTO coupons (code, type, value, min_order, usage_limit, times_used, expiry_date, is_active)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
			newCoupon.Code, newCoupon.Type, newCoupon.Value, newCoupon.MinOrder, newCoupon.UsageLimit, 0, newCoupon.ExpiryDate, newCoupon.IsActive)
		if err != nil {
			return fmt.Errorf("failed to insert coupon in transaction: %w", err)
		}
	}

	query := "UPDATE orders SET status = $1"
	args := []interface{}{status}
	argIdx := 2

	if paymentID != "" {
		query += fmt.Sprintf(", razorpay_payment_id = $%d", argIdx)
		args = append(args, paymentID)
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
		return fmt.Errorf("failed to update order status in transaction: %w", err)
	}

	return tx.Commit()
}

func (r *postgresOrderRepo) CancelPendingOrder(orderID string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	var status, couponCode, checkoutType, paymentMethod, fulfilmentType string
	err = tx.QueryRow(`SELECT status, COALESCE(coupon_code, ''), COALESCE(checkout_type, ''), COALESCE(payment_method, ''), COALESCE(fulfilment_type, '') FROM orders WHERE id = $1 FOR UPDATE`, orderID).
		Scan(&status, &couponCode, &checkoutType, &paymentMethod, &fulfilmentType)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		return err
	}

	if status != "pending" && status != "pending_payment" {
		return nil
	}

	rows, err := tx.Query(`SELECT product_id, quantity, COALESCE(size, '') FROM order_items WHERE order_id = $1`, orderID)
	if err != nil {
		return err
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
		if err := rows.Scan(&it.ProductID, &it.Quantity, &it.Size); err == nil {
			items = append(items, it)
		}
	}
	rows.Close()

	isPendingPickup := checkoutType == "pickup" && paymentMethod == "offline_qr"
	isPreorder := fulfilmentType == models.FulfilmentTypePreorderStorePickup || fulfilmentType == models.FulfilmentTypePreorderHomeDelivery
	if !isPendingPickup && !isPreorder {
		for _, item := range items {
			var totalStock int
			var sizesStockStr string
			var isProdPreorder bool
			err := tx.QueryRow("SELECT stock, COALESCE(sizes_stock, '{}'), COALESCE(is_preorder, FALSE) FROM products WHERE id = $1 FOR UPDATE", item.ProductID).
				Scan(&totalStock, &sizesStockStr, &isProdPreorder)
			if err == nil && !isProdPreorder {
				var sizesStock map[string]int
				json.Unmarshal([]byte(sizesStockStr), &sizesStock)
				if sizesStock == nil {
					sizesStock = map[string]int{}
				}

				if item.Size != "" && len(sizesStock) > 0 {
					if curr, ok := sizesStock[item.Size]; ok {
						sizesStock[item.Size] = curr + item.Quantity
					}
				}
				newTotalStock := totalStock + item.Quantity
				sizesStockBytes, _ := json.Marshal(sizesStock)
				tx.Exec("UPDATE products SET stock = $1, sizes_stock = $2 WHERE id = $3", newTotalStock, string(sizesStockBytes), item.ProductID)
			}
		}
	}

	if couponCode != "" {
		trimmedCode := strings.TrimSpace(couponCode)
		tx.Exec("UPDATE coupons SET used_count = GREATEST(0, used_count - 1) WHERE UPPER(TRIM(code)) = UPPER(TRIM($1))", trimmedCode)
	}

	_, err = tx.Exec("UPDATE orders SET status = 'cancelled' WHERE id = $1", orderID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *postgresOrderRepo) GetPendingDeliveryOrders() ([]models.Order, error) {
	dbRows, err := r.db.Query(`SELECT ` + orderColumns + `
		FROM orders WHERE status = 'paid'
		AND (checkout_type = 'delivery' OR checkout_type = 'hyderabad_instant')
		AND (fulfilment_type IS NULL OR fulfilment_type = '')`)
	if err != nil {
		return nil, err
	}
	defer dbRows.Close()

	var orders []models.Order
	for dbRows.Next() {
		o, err := scanOrder(dbRows)
		if err == nil {
			items, _ := r.getOrderItems(o.ID)
			o.Items = items
			orders = append(orders, o)
		}
	}
	return orders, nil
}

// ConfirmPreorderPickup marks a preorder store pickup order as COLLECTED.
// Idempotent: returns ErrAlreadyCollected if already collected (caller treats as success).
func (r *postgresOrderRepo) ConfirmPreorderPickup(orderID, adminEmail, notes string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	var status, fulfilmentType string
	err = tx.QueryRow(
		`SELECT status, COALESCE(fulfilment_type, '') FROM orders WHERE id = $1 FOR UPDATE`, orderID,
	).Scan(&status, &fulfilmentType)
	if err == sql.ErrNoRows {
		return fmt.Errorf("order not found")
	}
	if err != nil {
		return err
	}

	if fulfilmentType != models.FulfilmentTypePreorderStorePickup {
		return fmt.Errorf("order is not a preorder store pickup order")
	}

	if status == models.PreorderStatusCollected {
		return ErrAlreadyCollected
	}

	if status != models.PreorderStatusReadyForPickup && status != models.PreorderStatusAwaitingPickup {
		return fmt.Errorf("order must be in READY_FOR_PICKUP status to confirm collection (current: %s)", status)
	}

	now := time.Now().Format(time.RFC3339)

	_, err = tx.Exec(
		`UPDATE orders SET status = $1, pickup_collected_at = $2, pickup_collected_by = $3 WHERE id = $4`,
		models.PreorderStatusCollected, now, adminEmail, orderID,
	)
	if err != nil {
		return fmt.Errorf("failed to update order: %w", err)
	}

	_, err = tx.Exec(
		`INSERT INTO preorder_pickup_audit (order_id, action, performed_by, performed_at, notes) VALUES ($1, $2, $3, $4, $5)`,
		orderID, "COLLECTED", adminEmail, now, notes,
	)
	if err != nil {
		return fmt.Errorf("failed to insert audit entry: %w", err)
	}

	return tx.Commit()
}

// MarkPreorderPickupReady transitions a preorder store pickup order to READY_FOR_PICKUP.
func (r *postgresOrderRepo) MarkPreorderPickupReady(orderID string) error {
	tx, err := r.db.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	var status, fulfilmentType string
	err = tx.QueryRow(
		`SELECT status, COALESCE(fulfilment_type, '') FROM orders WHERE id = $1 FOR UPDATE`, orderID,
	).Scan(&status, &fulfilmentType)
	if err == sql.ErrNoRows {
		return fmt.Errorf("order not found")
	}
	if err != nil {
		return err
	}

	if fulfilmentType != models.FulfilmentTypePreorderStorePickup {
		return fmt.Errorf("order is not a preorder store pickup order")
	}

	// Idempotent
	if status == models.PreorderStatusReadyForPickup || status == models.PreorderStatusCollected {
		return nil
	}

	now := time.Now().Format(time.RFC3339)

	_, err = tx.Exec(
		`UPDATE orders SET status = $1 WHERE id = $2`,
		models.PreorderStatusReadyForPickup, orderID,
	)
	if err != nil {
		return fmt.Errorf("failed to update order status: %w", err)
	}

	_, err = tx.Exec(
		`INSERT INTO preorder_pickup_audit (order_id, action, performed_by, performed_at, notes) VALUES ($1, $2, $3, $4, $5)`,
		orderID, "READY_FOR_PICKUP", "admin", now, "",
	)
	if err != nil {
		return fmt.Errorf("failed to insert audit entry: %w", err)
	}

	return tx.Commit()
}

// MarkAllPreorderPickupReady transitions all eligible store pickup preorder orders to READY_FOR_PICKUP.
func (r *postgresOrderRepo) MarkAllPreorderPickupReady() (int, error) {
	tx, err := r.db.Begin()
	if err != nil {
		return 0, fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	rows, err := tx.Query(`
		SELECT id FROM orders 
		WHERE fulfilment_type = 'PREORDER_STORE_PICKUP' 
		  AND status IN ('paid', 'AWAITING_PICKUP')
		FOR UPDATE
	`)
	if err != nil {
		return 0, err
	}
	defer rows.Close()

	var orderIDs []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err == nil {
			orderIDs = append(orderIDs, id)
		}
	}
	rows.Close()

	if len(orderIDs) == 0 {
		return 0, nil
	}

	now := time.Now().Format(time.RFC3339)
	for _, id := range orderIDs {
		_, err = tx.Exec(`UPDATE orders SET status = $1 WHERE id = $2`, models.PreorderStatusReadyForPickup, id)
		if err != nil {
			return 0, fmt.Errorf("failed to update order %s: %w", id, err)
		}
		_, err = tx.Exec(
			`INSERT INTO preorder_pickup_audit (order_id, action, performed_by, performed_at, notes) VALUES ($1, $2, $3, $4, $5)`,
			id, "READY_FOR_PICKUP", "admin (bulk)", now, "Bulk marked ready for pickup",
		)
		if err != nil {
			return 0, fmt.Errorf("failed to insert audit for %s: %w", id, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return 0, err
	}

	return len(orderIDs), nil
}

// MarkPickupNotificationSent atomically sets pickup_notification_sent = TRUE.
func (r *postgresOrderRepo) MarkPickupNotificationSent(orderID string) error {
	_, err := r.db.Exec(`UPDATE orders SET pickup_notification_sent = TRUE WHERE id = $1`, orderID)
	return err
}

// GetPreorderPickupOrders returns preorder orders filtered by fulfilment type or pickup status.
func (r *postgresOrderRepo) GetPreorderPickupOrders(filter string) ([]models.Order, error) {
	baseQuery := `SELECT ` + orderColumns + `
		FROM orders WHERE fulfilment_type IN ('PREORDER_HOME_DELIVERY', 'PREORDER_STORE_PICKUP')`

	switch filter {
	case "store_pickup":
		baseQuery += " AND fulfilment_type = 'PREORDER_STORE_PICKUP'"
	case "home_delivery":
		baseQuery += " AND fulfilment_type = 'PREORDER_HOME_DELIVERY'"
	case "awaiting_pickup":
		baseQuery += " AND fulfilment_type = 'PREORDER_STORE_PICKUP' AND status IN ('paid', 'AWAITING_PICKUP', 'preorder_production', 'preorder_quality_check')"
	case "ready_for_pickup":
		baseQuery += " AND fulfilment_type = 'PREORDER_STORE_PICKUP' AND status = 'READY_FOR_PICKUP'"
	}
	baseQuery += " ORDER BY created_at DESC"

	dbRows, err := r.db.Query(baseQuery)
	if err != nil {
		return nil, err
	}
	defer dbRows.Close()

	var orders []models.Order
	for dbRows.Next() {
		o, err := scanOrder(dbRows)
		if err == nil {
			orders = append(orders, o)
		}
	}
	dbRows.Close()

	for i := range orders {
		items, _ := r.getOrderItems(orders[i].ID)
		orders[i].Items = items
		for _, it := range items {
			if it.IsPreorder {
				orders[i].IsPreorder = true
			}
		}
	}

	return orders, nil
}

// GetPreorderPickupAudit returns the audit trail for a preorder pickup order.
func (r *postgresOrderRepo) GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error) {
	dbRows, err := r.db.Query(
		`SELECT id, order_id, action, performed_by, performed_at, COALESCE(notes, '')
		 FROM preorder_pickup_audit WHERE order_id = $1 ORDER BY performed_at ASC`, orderID,
	)
	if err != nil {
		return nil, err
	}
	defer dbRows.Close()

	var entries []models.PreorderPickupAuditEntry
	for dbRows.Next() {
		var e models.PreorderPickupAuditEntry
		if err := dbRows.Scan(&e.ID, &e.OrderID, &e.Action, &e.PerformedBy, &e.PerformedAt, &e.Notes); err == nil {
			entries = append(entries, e)
		}
	}
	return entries, nil
}
