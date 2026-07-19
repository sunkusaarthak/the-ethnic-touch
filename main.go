package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

// Product represents a item in our store
type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"imageUrl"`
	Stock       int     `json:"stock"`
	Category    string  `json:"category"`
}

// Coupon represents a discount code
type Coupon struct {
	ID         string  `json:"id"`
	Code       string  `json:"code"`
	Type       string  `json:"type"` // "fixed", "percentage"
	Value      float64 `json:"value"`
	MinOrder   float64 `json:"minOrder"`
	ExpiryDate string  `json:"expiryDate"`
	IsActive   bool    `json:"isActive"`
	UsageLimit int     `json:"usageLimit"`
	UsedCount  int     `json:"usedCount"`
}

// OrderItem represents a item details bought in an order
type OrderItem struct {
	ProductID   string  `json:"productId"`
	Quantity    int     `json:"quantity"`
	PriceAtQty  float64 `json:"priceAtQty"`
	ProductName string  `json:"productName,omitempty"`
}

// Order represents a customer purchase
type Order struct {
	ID                string      `json:"id"`
	CustomerEmail     string      `json:"customerEmail"`
	TotalAmount       float64     `json:"totalAmount"`
	DiscountAmt       float64     `json:"discountAmt"`
	CouponCode        string      `json:"couponCode"`
	Status            string      `json:"status"` // "pending", "paid", "shipped", "cancelled"
	CreatedAt         string      `json:"createdAt"`
	RazorpayOrderID   string      `json:"razorpayOrderId"`
	RazorpayPaymentID string      `json:"razorpayPaymentId"`
	TrackingNumber    string      `json:"trackingNumber"`
	ShippedAt         string      `json:"shippedAt"`
	Items             []OrderItem `json:"items"`
	UnlockedGift      string      `json:"unlockedGift"`
}

// GiftTier represents a configured reward tier
type GiftTier struct {
	ID              int     `json:"id"`
	Name            string  `json:"name"`
	Threshold       float64 `json:"threshold"`
	RewardType      string  `json:"rewardType"`      // "coupon" or "physical"
	DiscountType    string  `json:"discountType"`    // "percentage" or "fixed"
	DiscountValue   float64 `json:"discountValue"`
	CouponFormat    string  `json:"couponFormat"`    // e.g. "GFT-SLVR-[RAND]"
	PhysicalName    string  `json:"physicalName"`    // e.g. "Premium Keychain"
}

// OrderCreateRequest represents storefront payload to initiate booking
type OrderCreateRequest struct {
	CustomerEmail string `json:"customerEmail"`
	CouponCode    string `json:"couponCode"`
	Items         []struct {
		ProductID string `json:"productId"`
		Quantity  int    `json:"quantity"`
	} `json:"items"`
}

// OrderVerifyRequest represents storefront verification cargo
type OrderVerifyRequest struct {
	OrderID           string `json:"orderId"`
	RazorpayOrderID   string `json:"razorpayOrderId"`
	RazorpayPaymentID string `json:"razorpayPaymentId"`
	RazorpaySignature string `json:"razorpaySignature"`
	Mock              bool   `json:"mock"`
}

var db *sql.DB

func initDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using system environment variables and defaults")
	}

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	sslmode := os.Getenv("DB_SSLMODE")

	if host == "" { host = "localhost" }
	if port == "" { port = "5432" }
	if user == "" { user = "postgres" }
	if dbname == "" { dbname = "ethnictouch" }
	if sslmode == "" { sslmode = "disable" }

	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbname, sslmode)
	log.Printf("Connecting to DB: host=%s port=%s user=%s dbname=%s sslmode=%s", host, port, user, dbname, sslmode)

	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Failed to open db:", err)
	}

	// Connection Pool Configuration
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Verify connection
	err = db.Ping()
	if err != nil {
		log.Fatal("Failed to connect to db (Ping):", err)
	}

	queries := []string{
		`CREATE TABLE IF NOT EXISTS products (
			id TEXT PRIMARY KEY,
			name TEXT,
			description TEXT,
			price NUMERIC(10,2),
			image_url TEXT,
			stock INTEGER DEFAULT 0,
			category TEXT
		);`,
		`CREATE TABLE IF NOT EXISTS coupons (
			id TEXT PRIMARY KEY,
			code TEXT UNIQUE,
			type TEXT,
			value NUMERIC(10,2),
			min_order NUMERIC(10,2),
			expiry_date TEXT,
			is_active BOOLEAN DEFAULT TRUE,
			usage_limit INTEGER,
			used_count INTEGER DEFAULT 0
		);`,
		`CREATE TABLE IF NOT EXISTS orders (
			id TEXT PRIMARY KEY,
			customer_email TEXT,
			total_amount NUMERIC(10,2),
			discount_amt NUMERIC(10,2),
			coupon_code TEXT,
			status TEXT,
			created_at TEXT
		);`,
		`CREATE TABLE IF NOT EXISTS order_items (
			order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
			product_id TEXT REFERENCES products(id),
			quantity INTEGER,
			price_at_qty NUMERIC(10,2)
		);`,
		`CREATE TABLE IF NOT EXISTS gift_tiers (
			id SERIAL PRIMARY KEY,
			name TEXT,
			threshold NUMERIC(10,2),
			reward_type TEXT,
			discount_type TEXT,
			discount_value NUMERIC(10,2),
			coupon_format TEXT,
			physical_name TEXT
		);`,
	}

	for _, q := range queries {
		_, err = db.Exec(q)
		if err != nil {
			log.Fatal("Failed to create table:", err)
		}
	}

	// Hot migrations for Razorpay, Tracking, Unlocked Gift & Gift Tiers Columns
	alterQueries := []string{
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS unlocked_gift TEXT;`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS name TEXT;`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS threshold NUMERIC(10,2);`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS reward_type TEXT;`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS discount_type TEXT;`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS discount_value NUMERIC(10,2);`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS coupon_format TEXT;`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS physical_name TEXT;`,
	}
	for _, q := range alterQueries {
		_, _ = db.Exec(q)
	}

	// Seed some base products if empty
	var count int
	db.QueryRow("SELECT COUNT(*) FROM products").Scan(&count)
	if count == 0 {
		seedQuery := `
		INSERT INTO products (id, name, description, price, image_url, stock, category) VALUES 
		('1', 'Pastel Peach Anarkali', 'A delicate premium silk Kurthi in soft peach, featuring intricate silver zari work.', 10999, './images/kurthi_peach.png', 10, 'Anarkali'),
		('2', 'Mint Breeze Straight Cut', 'Minimalist mint green kurthi perfect for a fresh, elegant everyday look.', 5499, './images/kurthi_mint.png', 15, 'Straight Cut'),
		('3', 'Lavender Dream Tunic', 'Indo-western fusion tunic in soft lavender. Premium georgette fabric.', 8999, './images/kurthi_lavender.png', 8, 'Tunic');
		`
		db.Exec(seedQuery)
		log.Println("Seeded base products successfully.")
	}

	// Seed a sample coupon if none exist
	var couponCount int
	db.QueryRow("SELECT COUNT(*) FROM coupons").Scan(&couponCount)
	if couponCount == 0 {
		db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit) VALUES ('c1', 'WELCOME10', 'percentage', 10, 1000, 100)")
		log.Println("Sample coupon WELCOME10 seeded successfully.")
	}

	// Seed default gift tiers if empty
	var tierCount int
	db.QueryRow("SELECT COUNT(*) FROM gift_tiers").Scan(&tierCount)
	if tierCount == 0 {
		seedTiers := `
		INSERT INTO gift_tiers (name, threshold, reward_type, discount_type, discount_value, coupon_format, physical_name) VALUES
		('Bronze Gift', 3000.00, 'physical', '', 0, '', 'Premium Leather Keychain'),
		('Silver Gift', 5000.00, 'coupon', 'percentage', 15.00, 'GFT-SLVR-[RAND]', ''),
		('Gold Gift', 10000.00, 'coupon', 'fixed', 2000.00, 'GFT-GOLD-[RAND]', '');
		`
		_, err = db.Exec(seedTiers)
		if err != nil {
			log.Println("Error seeding default gift tiers:", err)
		} else {
			log.Println("Seeded default gift tiers successfully.")
		}
	}
}

// Security Authentication Middleware for /api/admin/*
func adminAuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		authHeader := r.Header.Get("Authorization")
		expectedKey := os.Getenv("ADMIN_API_KEY")
		if expectedKey == "" {
			expectedKey = "admin_secret_token_123"
		}

		token := ""
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			token = authHeader[7:]
		}

		if token != expectedKey {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error":"Unauthorized access to admin API"}`))
			return
		}

		next(w, r)
	}
}

// Handlers
func productsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method == "GET" {
		rows, err := db.Query("SELECT id, name, description, price, image_url, stock, category FROM products")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var products []Product
		for rows.Next() {
			var p Product
			if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.ImageURL, &p.Stock, &p.Category); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			products = append(products, p)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(products)
	} else if r.Method == "POST" {
		// Protect Product Creation with Admin Authorization
		authHeader := r.Header.Get("Authorization")
		expectedKey := os.Getenv("ADMIN_API_KEY")
		if expectedKey == "" {
			expectedKey = "admin_secret_token_123"
		}
		token := ""
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			token = authHeader[7:]
		}
		if token != expectedKey {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error":"Unauthorized"}`))
			return
		}

		var p Product
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Security Fix: Prevent Panic index-out-of-bounds on short names
		uniqueSuffix := fmt.Sprint(time.Now().UnixNano() % 100000)
		prefix := "p_prod"
		if len(p.Name) >= 2 {
			prefix = "p_" + p.Name[:2]
		}
		p.ID = prefix + "_" + uniqueSuffix

		_, err := db.Exec("INSERT INTO products (id, name, description, price, image_url, stock, category) VALUES ($1, $2, $3, $4, $5, $6, $7)",
			p.ID, p.Name, p.Description, p.Price, p.ImageURL, p.Stock, p.Category)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(p)
	}
}

func couponHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "POST" {
		var c Coupon
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		c.ID = "c_" + c.Code
		_, err := db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (code) DO UPDATE SET type=$3, value=$4, min_order=$5, usage_limit=$6",
			c.ID, c.Code, c.Type, c.Value, c.MinOrder, c.UsageLimit)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(c)
	} else if r.Method == "GET" {
		rows, err := db.Query("SELECT id, code, type, value, min_order, usage_limit, used_count FROM coupons")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var coupons []Coupon
		for rows.Next() {
			var c Coupon
			rows.Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.UsageLimit, &c.UsedCount)
			c.IsActive = true
			coupons = append(coupons, c)
		}
		json.NewEncoder(w).Encode(coupons)
	}
}

func ordersListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	rows, err := db.Query(`SELECT id, customer_email, total_amount, discount_amt, coupon_code, status, created_at, 
		COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''), 
		COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, '') FROM orders ORDER BY created_at DESC`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var orders []Order
	for rows.Next() {
		var o Order
		err := rows.Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt,
			&o.RazorpayOrderID, &o.RazorpayPaymentID, &o.TrackingNumber, &o.ShippedAt, &o.UnlockedGift)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		itemRows, err := db.Query(`SELECT oi.product_id, oi.quantity, oi.price_at_qty, p.name 
			FROM order_items oi 
			JOIN products p ON oi.product_id = p.id 
			WHERE oi.order_id = $1`, o.ID)
		if err == nil {
			var items []OrderItem
			for itemRows.Next() {
				var it OrderItem
				if err := itemRows.Scan(&it.ProductID, &it.Quantity, &it.PriceAtQty, &it.ProductName); err == nil {
					items = append(items, it)
				}
			}
			itemRows.Close()
			o.Items = items
		}

		orders = append(orders, o)
	}
	json.NewEncoder(w).Encode(orders)
}

func couponValidateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	var req struct {
		Code  string  `json:"code"`
		Total float64 `json:"total"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	var c Coupon
	err := db.QueryRow("SELECT id, code, type, value, min_order, usage_limit, used_count FROM coupons WHERE code = $1 AND is_active = TRUE", req.Code).
		Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.UsageLimit, &c.UsedCount)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error":"Invalid or expired coupon"}`))
		return
	}
	if req.Total < c.MinOrder {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(fmt.Sprintf(`{"error":"Minimum order of ₹%.2f required"}`, c.MinOrder)))
		return
	}
	if c.UsageLimit > 0 && c.UsedCount >= c.UsageLimit {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Coupon usage limit reached"}`))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func orderCreateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req OrderCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid request payload"}`))
		return
	}

	if req.CustomerEmail == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Email is required"}`))
		return
	}

	if len(req.Items) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"No items in the order"}`))
		return
	}

	tx, err := db.Begin()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to start database transaction"}`))
		return
	}
	defer tx.Rollback()

	var subtotal float64
	var orderItems []OrderItem

	// Security: Fetch product details from DB instead of trusting client totals
	for _, it := range req.Items {
		if it.Quantity <= 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Quantity must be greater than zero"}`))
			return
		}

		var p Product
		err := tx.QueryRow("SELECT id, name, price, stock FROM products WHERE id = $1", it.ProductID).
			Scan(&p.ID, &p.Name, &p.Price, &p.Stock)
		if err == sql.ErrNoRows {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(fmt.Sprintf(`{"error":"Product with ID %s not found"}`, it.ProductID)))
			return
		} else if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Failed to verify products"}`))
			return
		}

		if p.Stock < it.Quantity {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(fmt.Sprintf(`{"error":"Insufficient stock of %s (In stock: %d)"}`, p.Name, p.Stock)))
			return
		}

		subtotal += p.Price * float64(it.Quantity)
		orderItems = append(orderItems, OrderItem{
			ProductID:  it.ProductID,
			Quantity:   it.Quantity,
			PriceAtQty: p.Price,
		})
	}

	// Verify Coupon on server
	var discountAmt float64
	if req.CouponCode != "" {
		var c Coupon
		err := tx.QueryRow("SELECT id, code, type, value, min_order, usage_limit, used_count FROM coupons WHERE code = $1 AND is_active = TRUE", req.CouponCode).
			Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.UsageLimit, &c.UsedCount)
		if err == sql.ErrNoRows {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Invalid coupon code"}`))
			return
		} else if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Coupon validation failure"}`))
			return
		}

		if subtotal < c.MinOrder {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(fmt.Sprintf(`{"error":"Minimum order of ₹%.2f required to use this coupon"}`, c.MinOrder)))
			return
		}

		if c.UsageLimit > 0 && c.UsedCount >= c.UsageLimit {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Coupon usage limit has been reached"}`))
			return
		}

		if c.Type == "fixed" {
			discountAmt = c.Value
		} else if c.Type == "percentage" {
			discountAmt = (subtotal * c.Value) / 100
		}

		if discountAmt > subtotal {
			discountAmt = subtotal
		}
	}

	finalTotal := subtotal - discountAmt
	orderID := "ORD_" + fmt.Sprint(time.Now().UnixNano()/1000000)

	paymentProvider := os.Getenv("PAYMENT_PROVIDER")
	if paymentProvider == "" {
		paymentProvider = "mock"
	}

	var providerOrderID string
	var checkoutURL string

	if paymentProvider == "razorpay" {
		rzpID, err := createRazorpayOrder(orderID, finalTotal)
		if err != nil {
			log.Printf("Razorpay order creation failed: %v", err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Razorpay service authentication failed"}`))
			return
		}
		providerOrderID = rzpID
		checkoutURL = "razorpay"
	} else {
		// Mock Provider configuration
		providerOrderID = "MOCK_RZP_" + orderID[4:]
		checkoutURL = fmt.Sprintf("/mock-payment?orderId=%s", orderID)
	}

	createdAt := time.Now().Format(time.RFC3339)
	_, err = tx.Exec(`INSERT INTO orders (id, customer_email, total_amount, discount_amt, coupon_code, status, created_at, razorpay_order_id, razorpay_payment_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		orderID, req.CustomerEmail, finalTotal, discountAmt, req.CouponCode, "pending", createdAt, providerOrderID, "")
	if err != nil {
		log.Printf("Order insert SQL failed: %v", err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to store order in database"}`))
		return
	}

	for _, item := range orderItems {
		_, err = tx.Exec("INSERT INTO order_items (order_id, product_id, quantity, price_at_qty) VALUES ($1, $2, $3, $4)",
			orderID, item.ProductID, item.Quantity, item.PriceAtQty)
		if err != nil {
			log.Printf("OrderItem SQL insert failed: %v", err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Failed to store order checkout items"}`))
			return
		}
	}

	err = tx.Commit()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to commit order transaction"}`))
		return
	}

	resp := map[string]interface{}{
		"orderId":         orderID,
		"checkoutUrl":     checkoutURL,
		"razorpayOrderId": providerOrderID,
		"amount":          finalTotal,
		"razorpayKey":     os.Getenv("RAZORPAY_KEY_ID"),
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func orderVerifyHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req OrderVerifyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid payload"}`))
		return
	}

	var status string
	var couponCode string
	var totalAmount float64
	var customerEmail string
	err := db.QueryRow("SELECT status, coupon_code, total_amount, customer_email FROM orders WHERE id = $1", req.OrderID).
		Scan(&status, &couponCode, &totalAmount, &customerEmail)
	if err == sql.ErrNoRows {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error":"Order not found"}`))
		return
	} else if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Database error"}`))
		return
	}

	if status != "pending" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{"orderId": req.OrderID, "status": status, "message": "Order already processed"})
		return
	}

	paymentProvider := os.Getenv("PAYMENT_PROVIDER")
	if paymentProvider == "" {
		paymentProvider = "mock"
	}

	if req.Mock {
		if paymentProvider != "mock" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Mock payment is disabled"}`))
			return
		}
	} else {
		keySecret := os.Getenv("RAZORPAY_KEY_SECRET")
		if keySecret == "" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Razorpay keys missing on server"}`))
			return
		}

		data := req.RazorpayOrderID + "|" + req.RazorpayPaymentID
		h := hmac.New(sha256.New, []byte(keySecret))
		h.Write([]byte(data))
		generatedSig := hex.EncodeToString(h.Sum(nil))

		if generatedSig != req.RazorpaySignature {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Razorpay payment check failed (Signature mismatched)"}`))
			return
		}
	}

	tx, err := db.Begin()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to initialize checkout lock"}`))
		return
	}
	defer tx.Rollback()

	// Fetch buy list details to process stock deduction
	rows, err := tx.Query("SELECT product_id, quantity FROM order_items WHERE order_id = $1", req.OrderID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to fetch order items for delivery mapping"}`))
		return
	}
	defer rows.Close()

	type deduct struct {
		prodID string
		qty    int
	}
	var deductions []deduct
	for rows.Next() {
		var d deduct
		if err := rows.Scan(&d.prodID, &d.qty); err == nil {
			deductions = append(deductions, d)
		}
	}
	rows.Close()

	// Reduce inventory stock levels safely
	for _, d := range deductions {
		res, err := tx.Exec("UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1", d.qty, d.prodID)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Inventory database update conflict"}`))
			return
		}
		rowsAffected, _ := res.RowsAffected()
		if rowsAffected == 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(`{"error":"Out of stock items selected"}`))
			return
		}
	}

	// Update Coupons Use Count metric
	if couponCode != "" {
		_, err = tx.Exec("UPDATE coupons SET used_count = used_count + 1 WHERE code = $1", couponCode)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(`{"error":"Coupon mapping registration failure"}`))
			return
		}
	}

	// Turn status to paid
	payID := req.RazorpayPaymentID
	if req.Mock {
		payID = "MOCK_PAY_" + fmt.Sprint(time.Now().Unix())
	}
	_, err = tx.Exec("UPDATE orders SET status = 'paid', razorpay_payment_id = $1 WHERE id = $2", payID, req.OrderID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to change order paid status"}`))
		return
	}

	err = tx.Commit()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to commit finalized order payload"}`))
		return
	}

	// Send promotional gift coupon if qualified for a tier
	var giftCode string
	var rewardType string
	var unlockedGift string

	var discountType, couponFormat, physicalName string
	var discountValueThreshold float64
	var tierFound bool

	// query database for highest matching tier
	rowsTier, err := db.Query("SELECT reward_type, discount_type, discount_value, coupon_format, physical_name FROM gift_tiers WHERE $1 >= threshold ORDER BY threshold DESC LIMIT 1", totalAmount)
	if err == nil {
		if rowsTier.Next() {
			err = rowsTier.Scan(&rewardType, &discountType, &discountValueThreshold, &couponFormat, &physicalName)
			if err == nil {
				tierFound = true
			}
		}
		rowsTier.Close()
	}

	if tierFound {
		if rewardType == "coupon" {
			giftCode = generateCouponCode(couponFormat, req.OrderID)
			unlockedGift = giftCode
			log.Printf("[GIFT SYSTEM] Generated coupon for %s: %s (Format: %s, Value: %.2f)", customerEmail, giftCode, couponFormat, discountValueThreshold)
			_, err = db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING",
				"c_"+giftCode, giftCode, discountType, discountValueThreshold, 0, 1)
			if err != nil {
				log.Printf("Failed to seed generated coupon into DB: %v", err)
			}
		} else if rewardType == "physical" {
			unlockedGift = physicalName
			log.Printf("[GIFT SYSTEM] Awarded physical item for %s: %s", customerEmail, physicalName)
		}

		if unlockedGift != "" {
			_, err = db.Exec("UPDATE orders SET unlocked_gift = $1 WHERE id = $2", unlockedGift, req.OrderID)
			if err != nil {
				log.Printf("Failed to update order with unlocked gift: %v", err)
			}
		}
	}

	// AUTOMATED SHIPPING INTEGRATION PIPELINE
	trackingNumber, shippedAt, err := automateShipping(req.OrderID, customerEmail)
	if err != nil {
		log.Printf("[SHIPPING ERROR] Automated shipment dispatch failed: %v", err)
	} else {
		_, err = db.Exec("UPDATE orders SET status = 'shipped', tracking_number = $1, shipped_at = $2 WHERE id = $3",
			trackingNumber, shippedAt, req.OrderID)
		if err != nil {
			log.Printf("[SHIPPING ERROR] Failed to update orders tracking dataset: %v", err)
		} else {
			log.Printf("[SHIPPING SUCCESS] Order %s dispatched automatically. Tracking ID: %s", req.OrderID, trackingNumber)
			status = "shipped"
		}
	}

	// Success response containing tracking and rewards code
	resp := map[string]interface{}{
		"orderId":        req.OrderID,
		"status":         status,
		"trackingNumber": trackingNumber,
		"giftCode":       giftCode,
		"unlockedGift":   unlockedGift,
		"giftType":       rewardType,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func createRazorpayOrder(receiptID string, totalAmount float64) (string, error) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")
	if keyID == "" || keySecret == "" {
		return "", errors.New("Razorpay Key ID and Secret not configured in environment")
	}

	// Razorpay requires amounts to be passed in paise
	amountPaise := int(math.Round(totalAmount * 100))

	payload := map[string]interface{}{
		"amount":   amountPaise,
		"currency": "INR",
		"receipt":  receiptID,
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.razorpay.com/v1/orders", bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	authHeaderVal := "Basic " + base64.StdEncoding.EncodeToString([]byte(keyID+":"+keySecret))
	req.Header.Set("Authorization", authHeaderVal)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		respBody, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("Razorpay HTTP status %d: %s", resp.StatusCode, string(respBody))
	}

	var result struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}

	return result.ID, nil
}

func automateShipping(orderID string, email string) (string, string, error) {
	shippingProvider := os.Getenv("SHIPPING_PROVIDER")
	if shippingProvider == "" {
		shippingProvider = "mock"
	}

	log.Printf("[SHIPPING PIPELINE] Dispatching order %s to %s via %s provider...", orderID, email, shippingProvider)

	if shippingProvider == "mock" {
		randomID := fmt.Sprint(time.Now().UnixNano() % 1000000)
		trackingID := "TRK-INI-" + randomID
		shippedAt := time.Now().Format(time.RFC3339)
		return trackingID, shippedAt, nil
	}

	// Template for live carrier integration (Delhivery / Shiprocket etc)
	/*
		carrierURL := "https://api.delhivery.com/v1/packages"
		// Make HTTP calls to carrier services reporting packages
	*/
	return "", "", errors.New("unsupported carrier provider configuration")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	status := "up"
	dbStatus := "connected"

	err := db.Ping()
	if err != nil {
		status = "degraded"
		dbStatus = "disconnected"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":   status,
		"database": dbStatus,
		"time":     time.Now().Format(time.RFC3339),
	})
}

func main() {
	initDB()
	defer db.Close()

	// Storefront routes
	http.HandleFunc("/api/products", productsHandler)
	http.HandleFunc("/api/coupons/validate", couponValidateHandler)
	http.HandleFunc("/api/orders", orderCreateHandler)
	http.HandleFunc("/api/orders/verify", orderVerifyHandler)
	http.HandleFunc("/api/gift-tiers", giftTiersGetHandler)

	// Protected Admin routes
	http.HandleFunc("/api/admin/coupons", adminAuthMiddleware(couponHandler))
	http.HandleFunc("/api/admin/orders", adminAuthMiddleware(ordersListHandler))
	http.HandleFunc("/api/admin/gift-tiers", adminAuthMiddleware(giftTiersUpdateHandler))

	// Health endpoint
	http.HandleFunc("/health", healthHandler)

	// File server
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server executing on http://*:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func giftTiersGetHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query("SELECT id, name, threshold, reward_type, discount_type, discount_value, coupon_format, physical_name FROM gift_tiers ORDER BY threshold ASC")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	tiers := []GiftTier{}
	for rows.Next() {
		var t GiftTier
		err := rows.Scan(&t.ID, &t.Name, &t.Threshold, &t.RewardType, &t.DiscountType, &t.DiscountValue, &t.CouponFormat, &t.PhysicalName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		tiers = append(tiers, t)
	}

	json.NewEncoder(w).Encode(tiers)
}

func giftTiersUpdateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(`{"error":"Method not allowed"}`))
		return
	}

	var reqTiers []GiftTier
	if err := json.NewDecoder(r.Body).Decode(&reqTiers); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(fmt.Sprintf(`{"error":"%s"}`, err.Error())))
		return
	}

	tx, err := db.Begin()
	if err != nil {
		log.Printf("[GIFT ADMIN ERROR] Transaction start failed: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Transaction start failed"}`))
		return
	}
	defer tx.Rollback()

	_, err = tx.Exec("DELETE FROM gift_tiers")
	if err != nil {
		log.Printf("[GIFT ADMIN ERROR] Clear old tiers failed: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf(`{"error":"Clear old tiers failed: %s"}`, err.Error())))
		return
	}

	for _, t := range reqTiers {
		_, err = tx.Exec(`INSERT INTO gift_tiers (name, threshold, reward_type, discount_type, discount_value, coupon_format, physical_name) 
			VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			t.Name, t.Threshold, t.RewardType, t.DiscountType, t.DiscountValue, t.CouponFormat, t.PhysicalName)
		if err != nil {
			log.Printf("[GIFT ADMIN ERROR] Insert tier failed (Tier: %s): %v", t.Name, err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(fmt.Sprintf(`{"error":"Insert tier failed: %s"}`, err.Error())))
			return
		}
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("[GIFT ADMIN ERROR] Commit failed: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Commit failed"}`))
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Gift tiers updated successfully"})
}

func generateRandomAlphanumeric(n int) string {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	bytes := make([]byte, n)
	_, _ = rand.Read(bytes)
	for i, b := range bytes {
		bytes[i] = letters[b%byte(len(letters))]
	}
	return string(bytes)
}

func generateCouponCode(format string, orderID string) string {
	if format == "" {
		return "GFT-" + orderID[4:8]
	}
	randomStr := generateRandomAlphanumeric(4)
	return strings.Replace(format, "[RAND]", randomStr, -1)
}
