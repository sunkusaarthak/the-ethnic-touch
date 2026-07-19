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
	"regexp"
	"strconv"
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
	ShippingName      string      `json:"shippingName"`
	ShippingPhone     string      `json:"shippingPhone"`
	ShippingAddress   string      `json:"shippingAddress"`
	ShippingCity      string      `json:"shippingCity"`
	ShippingState     string      `json:"shippingState"`
	ShippingZIPCode   string      `json:"shippingZipCode"`
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

type Profile struct {
	UserID        string `json:"userId"`
	Email         string `json:"email"`
	FullName      string `json:"fullName"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	City          string `json:"city"`
	State         string `json:"state"`
	ZIPCode       string `json:"zipCode"`
	PreferredSize string `json:"preferredSize,omitempty"`
	StyleNotes    string `json:"styleNotes,omitempty"`
	CreatedAt     string `json:"createdAt"`
	UpdatedAt     string `json:"updatedAt"`
}

type Address struct {
	ID          int    `json:"id"`
	UserID      string `json:"userId"`
	FullName    string `json:"fullName"`
	Phone       string `json:"phone"`
	AddressLine string `json:"addressLine"`
	City        string `json:"city"`
	State       string `json:"state"`
	ZIPCode     string `json:"zipCode"`
	IsDefault   bool   `json:"isDefault"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

// OrderCreateRequest represents storefront payload to initiate booking
type OrderCreateRequest struct {
	CustomerEmail   string `json:"customerEmail"`
	CouponCode      string `json:"couponCode"`
	ShippingName    string `json:"shippingName"`
	ShippingPhone   string `json:"shippingPhone"`
	ShippingAddress string `json:"shippingAddress"`
	ShippingCity    string `json:"shippingCity"`
	ShippingState   string `json:"shippingState"`
	ShippingZIPCode string `json:"shippingZipCode"`
	Items           []struct {
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

var (
	profileNamePattern  = regexp.MustCompile(`^[A-Za-z][A-Za-z\s.'-]{1,79}$`)
	profilePhonePattern = regexp.MustCompile(`^\+?[0-9()\-\s]{8,15}$`)
	profileZIPPattern   = regexp.MustCompile(`^[A-Za-z0-9\-\s]{3,12}$`)
)

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
		`CREATE TABLE IF NOT EXISTS profiles (
			user_id TEXT PRIMARY KEY,
			email TEXT DEFAULT '',
			full_name TEXT NOT NULL,
			phone TEXT NOT NULL,
			address TEXT NOT NULL,
			city TEXT NOT NULL,
			state TEXT NOT NULL,
			zip_code TEXT NOT NULL,
			preferred_size TEXT,
			style_notes TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS addresses (
			id SERIAL PRIMARY KEY,
			user_id TEXT NOT NULL,
			full_name TEXT NOT NULL,
			phone TEXT NOT NULL,
			address_line TEXT NOT NULL,
			city TEXT NOT NULL,
			state TEXT NOT NULL,
			zip_code TEXT NOT NULL,
			is_default BOOLEAN DEFAULT FALSE,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);`,
	}

	for _, q := range queries {
		_, err = db.Exec(q)
		if err != nil {
			log.Fatal("Failed to create table:", err)
		}
	}

	// Hot migrations for Razorpay, Tracking, Unlocked Gift, Gift Tiers, Profiles, Coupons & Address Columns
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
		`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';`,
		`ALTER TABLE coupons ADD COLUMN IF NOT EXISTS owner_email TEXT DEFAULT '';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_name TEXT DEFAULT '';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_phone TEXT DEFAULT '';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address TEXT DEFAULT '';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city TEXT DEFAULT '';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_state TEXT DEFAULT '';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_zip_code TEXT DEFAULT '';`,
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
		COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, ''),
		COALESCE(shipping_name, ''), COALESCE(shipping_phone, ''), COALESCE(shipping_address, ''),
		COALESCE(shipping_city, ''), COALESCE(shipping_state, ''), COALESCE(shipping_zip_code, '') FROM orders ORDER BY created_at DESC`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var orders []Order
	for rows.Next() {
		var o Order
		err := rows.Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt,
			&o.RazorpayOrderID, &o.RazorpayPaymentID, &o.TrackingNumber, &o.ShippedAt, &o.UnlockedGift,
			&o.ShippingName, &o.ShippingPhone, &o.ShippingAddress, &o.ShippingCity, &o.ShippingState, &o.ShippingZIPCode)
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
	_, err = tx.Exec(`INSERT INTO orders (id, customer_email, total_amount, discount_amt, coupon_code, status, created_at, razorpay_order_id, razorpay_payment_id,
		shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip_code)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
		orderID, req.CustomerEmail, finalTotal, discountAmt, req.CouponCode, "pending", createdAt, providerOrderID, "",
		req.ShippingName, req.ShippingPhone, req.ShippingAddress, req.ShippingCity, req.ShippingState, req.ShippingZIPCode)
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
			_, err = db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit, owner_email) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING",
				"c_"+giftCode, giftCode, discountType, discountValueThreshold, 0, 1, customerEmail)
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

func getAuthenticatedUserID(r *http.Request) string {
	if userID := r.Header.Get("X-User-Id"); userID != "" {
		return userID
	}
	return ""
}

func normalizeProfilePayload(payload *Profile) error {
	payload.FullName = strings.TrimSpace(payload.FullName)
	payload.Phone = strings.TrimSpace(payload.Phone)
	payload.Address = strings.TrimSpace(payload.Address)
	payload.City = strings.TrimSpace(payload.City)
	payload.State = strings.TrimSpace(payload.State)
	payload.ZIPCode = strings.TrimSpace(payload.ZIPCode)
	payload.PreferredSize = strings.TrimSpace(payload.PreferredSize)
	payload.StyleNotes = strings.TrimSpace(payload.StyleNotes)

	if payload.FullName == "" || payload.Phone == "" || payload.Address == "" || payload.City == "" || payload.State == "" || payload.ZIPCode == "" {
		return fmt.Errorf("fullName, phone, address, city, state, and zipCode are required")
	}
	if !profileNamePattern.MatchString(payload.FullName) {
		return fmt.Errorf("fullName must contain only letters, spaces, dots, apostrophes, or hyphens")
	}
	if !profilePhonePattern.MatchString(payload.Phone) {
		return fmt.Errorf("phone must be a valid phone number")
	}
	if len(payload.Address) < 5 {
		return fmt.Errorf("address must be at least 5 characters")
	}
	if len(payload.City) < 2 || len(payload.State) < 2 {
		return fmt.Errorf("city and state must be at least 2 characters")
	}
	if !profileZIPPattern.MatchString(payload.ZIPCode) {
		return fmt.Errorf("zipCode must be a valid postal code")
	}
	if payload.PreferredSize != "" && payload.PreferredSize != "XS" && payload.PreferredSize != "S" && payload.PreferredSize != "M" && payload.PreferredSize != "L" && payload.PreferredSize != "XL" {
		return fmt.Errorf("preferredSize must be one of XS, S, M, L, or XL")
	}
	if len(payload.StyleNotes) > 500 {
		return fmt.Errorf("styleNotes must be 500 characters or fewer")
	}
	return nil
}

func profileMeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-Id")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := getAuthenticatedUserID(r)
	if userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		var profile Profile
		err := db.QueryRow(`SELECT user_id, email, full_name, phone, address, city, state, zip_code, preferred_size, style_notes, created_at, updated_at 
			FROM profiles WHERE user_id = $1`, userID).
			Scan(&profile.UserID, &profile.Email, &profile.FullName, &profile.Phone, &profile.Address, &profile.City, &profile.State, &profile.ZIPCode, &profile.PreferredSize, &profile.StyleNotes, &profile.CreatedAt, &profile.UpdatedAt)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "profile not found", http.StatusNotFound)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(profile)
		return

	case http.MethodPost, http.MethodPatch:
		var payload Profile
		r.Body = http.MaxBytesReader(w, r.Body, 32<<10)
		decoder := json.NewDecoder(r.Body)
		decoder.DisallowUnknownFields()
		if err := decoder.Decode(&payload); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if decoder.Decode(&struct{}{}) != io.EOF {
			http.Error(w, "request body must contain a single JSON object", http.StatusBadRequest)
			return
		}
		if err := normalizeProfilePayload(&payload); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		now := time.Now().UTC().Format(time.RFC3339)
		createdAt := now
		var existingCreatedAt string
		existingErr := db.QueryRow("SELECT created_at FROM profiles WHERE user_id = $1", userID).Scan(&existingCreatedAt)
		if existingErr == nil {
			createdAt = existingCreatedAt
		} else if existingErr != sql.ErrNoRows {
			http.Error(w, existingErr.Error(), http.StatusInternalServerError)
			return
		}

		_, err := db.Exec(`
			INSERT INTO profiles (user_id, email, full_name, phone, address, city, state, zip_code, preferred_size, style_notes, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
			ON CONFLICT(user_id) DO UPDATE SET
				email = EXCLUDED.email,
				full_name = EXCLUDED.full_name,
				phone = EXCLUDED.phone,
				address = EXCLUDED.address,
				city = EXCLUDED.city,
				state = EXCLUDED.state,
				zip_code = EXCLUDED.zip_code,
				preferred_size = EXCLUDED.preferred_size,
				style_notes = EXCLUDED.style_notes,
				updated_at = EXCLUDED.updated_at
		`, userID, payload.Email, payload.FullName, payload.Phone, payload.Address, payload.City, payload.State, payload.ZIPCode, payload.PreferredSize, payload.StyleNotes, createdAt, now)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if payload.Address != "" && payload.City != "" && payload.State != "" && payload.ZIPCode != "" {
			var defID int
			err = db.QueryRow("SELECT id FROM addresses WHERE user_id = $1 AND is_default = TRUE", userID).Scan(&defID)
			if err == sql.ErrNoRows {
				_, err = db.Exec(`
					INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, zip_code, is_default, created_at, updated_at)
					VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8, $8)
				`, userID, payload.FullName, payload.Phone, payload.Address, payload.City, payload.State, payload.ZIPCode, now)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			} else if err == nil {
				_, err = db.Exec(`
					UPDATE addresses SET full_name = $1, phone = $2, address_line = $3, city = $4, state = $5, zip_code = $6, updated_at = $7
					WHERE id = $8
				`, payload.FullName, payload.Phone, payload.Address, payload.City, payload.State, payload.ZIPCode, now, defID)
				if err != nil {
					http.Error(w, err.Error(), http.StatusInternalServerError)
					return
				}
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		w.Header().Set("Content-Type", "application/json")
		if existingErr == sql.ErrNoRows {
			w.WriteHeader(http.StatusCreated)
		}
		json.NewEncoder(w).Encode(Profile{
			UserID:        userID,
			Email:         payload.Email,
			FullName:      payload.FullName,
			Phone:         payload.Phone,
			Address:       payload.Address,
			City:          payload.City,
			State:         payload.State,
			ZIPCode:       payload.ZIPCode,
			PreferredSize: payload.PreferredSize,
			StyleNotes:    payload.StyleNotes,
			CreatedAt:     createdAt,
			UpdatedAt:     now,
		})
		return
	default:
		w.Header().Set("Allow", "GET, POST, PATCH, OPTIONS")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

func profileAddressesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-Id")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := getAuthenticatedUserID(r)
	if userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)

	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query(`SELECT id, user_id, full_name, phone, address_line, city, state, zip_code, is_default, created_at, updated_at 
			FROM addresses WHERE user_id = $1 ORDER BY id DESC`, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		addresses := []Address{}
		for rows.Next() {
			var addr Address
			err := rows.Scan(&addr.ID, &addr.UserID, &addr.FullName, &addr.Phone, &addr.AddressLine, &addr.City, &addr.State, &addr.ZIPCode, &addr.IsDefault, &addr.CreatedAt, &addr.UpdatedAt)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			addresses = append(addresses, addr)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(addresses)
		return

	case http.MethodPost:
		var payload Address
		r.Body = http.MaxBytesReader(w, r.Body, 10<<10) // 10KB
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		payload.FullName = strings.TrimSpace(payload.FullName)
		payload.Phone = strings.TrimSpace(payload.Phone)
		payload.AddressLine = strings.TrimSpace(payload.AddressLine)
		payload.City = strings.TrimSpace(payload.City)
		payload.State = strings.TrimSpace(payload.State)
		payload.ZIPCode = strings.TrimSpace(payload.ZIPCode)

		if payload.FullName == "" || payload.Phone == "" || payload.AddressLine == "" || payload.City == "" || payload.State == "" || payload.ZIPCode == "" {
			http.Error(w, "all address fields are required", http.StatusBadRequest)
			return
		}

		if payload.ID > 0 {
			var count int
			err := db.QueryRow("SELECT COUNT(*) FROM addresses WHERE id = $1 AND user_id = $2", payload.ID, userID).Scan(&count)
			if err != nil || count == 0 {
				http.Error(w, "address not found or unauthorized", http.StatusNotFound)
				return
			}

			var isDefault bool
			_ = db.QueryRow("SELECT is_default FROM addresses WHERE id = $1", payload.ID).Scan(&isDefault)

			_, err = db.Exec(`UPDATE addresses SET full_name=$1, phone=$2, address_line=$3, city=$4, state=$5, zip_code=$6, updated_at=$7 
				WHERE id=$8`, payload.FullName, payload.Phone, payload.AddressLine, payload.City, payload.State, payload.ZIPCode, now, payload.ID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			if isDefault {
				_, _ = db.Exec(`UPDATE profiles SET full_name=$1, phone=$2, address=$3, city=$4, state=$5, zip_code=$6, updated_at=$7 
					WHERE user_id=$8`, payload.FullName, payload.Phone, payload.AddressLine, payload.City, payload.State, payload.ZIPCode, now, userID)
			}

			payload.UserID = userID
			payload.UpdatedAt = now
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(payload)
			return
		} else {
			var count int
			_ = db.QueryRow("SELECT COUNT(*) FROM addresses WHERE user_id = $1", userID).Scan(&count)
			isDefault := false
			if count == 0 {
				isDefault = true
			}

			var newID int
			err := db.QueryRow(`
				INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, zip_code, is_default, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
			`, userID, payload.FullName, payload.Phone, payload.AddressLine, payload.City, payload.State, payload.ZIPCode, isDefault, now, now).Scan(&newID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			payload.ID = newID
			payload.UserID = userID
			payload.IsDefault = isDefault
			payload.CreatedAt = now
			payload.UpdatedAt = now

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(payload)
			return
		}

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "missing address id", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "invalid address id", http.StatusBadRequest)
			return
		}

		var count int
		err = db.QueryRow("SELECT COUNT(*) FROM addresses WHERE id = $1 AND user_id = $2", id, userID).Scan(&count)
		if err != nil || count == 0 {
			http.Error(w, "address not found or unauthorized", http.StatusNotFound)
			return
		}

		_, err = db.Exec("DELETE FROM addresses WHERE id = $1", id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"address deleted successfully"}`))
		return

	case http.MethodPatch:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			http.Error(w, "missing address id", http.StatusBadRequest)
			return
		}
		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "invalid address id", http.StatusBadRequest)
			return
		}

		var count int
		err = db.QueryRow("SELECT COUNT(*) FROM addresses WHERE id = $1 AND user_id = $2", id, userID).Scan(&count)
		if err != nil || count == 0 {
			http.Error(w, "address not found or unauthorized", http.StatusNotFound)
			return
		}

		tx, err := db.Begin()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer tx.Rollback()

		_, err = tx.Exec("UPDATE addresses SET is_default = FALSE WHERE user_id = $1", userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err = tx.Exec("UPDATE addresses SET is_default = TRUE WHERE id = $1", id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var fName, tel, road, town, region, zip string
		err = tx.QueryRow("SELECT full_name, phone, address_line, city, state, zip_code FROM addresses WHERE id = $1", id).Scan(&fName, &tel, &road, &town, &region, &zip)
		if err == nil {
			_, err = tx.Exec(`UPDATE profiles SET full_name=$1, phone=$2, address=$3, city=$4, state=$5, zip_code=$6, updated_at=$7 
				WHERE user_id=$8`, fName, tel, road, town, region, zip, now, userID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		err = tx.Commit()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"address set as default"}`))
		return

	default:
		w.Header().Set("Allow", "GET, POST, DELETE, PATCH, OPTIONS")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
}

func profileOrdersHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-Id")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := getAuthenticatedUserID(r)
	if userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	var email string
	err := db.QueryRow("SELECT email FROM profiles WHERE user_id = $1", userID).Scan(&email)
	if err != nil {
		if err == sql.ErrNoRows {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode([]Order{})
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	orders := []Order{}
	if email != "" {
		rows, err := db.Query(`SELECT id, customer_email, total_amount, discount_amt, coupon_code, status, created_at, 
			COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''), 
			COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, ''),
			COALESCE(shipping_name, ''), COALESCE(shipping_phone, ''), COALESCE(shipping_address, ''),
			COALESCE(shipping_city, ''), COALESCE(shipping_state, ''), COALESCE(shipping_zip_code, '') FROM orders WHERE customer_email = $1 ORDER BY created_at DESC`, email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		for rows.Next() {
			var o Order
			err := rows.Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt,
				&o.RazorpayOrderID, &o.RazorpayPaymentID, &o.TrackingNumber, &o.ShippedAt, &o.UnlockedGift,
				&o.ShippingName, &o.ShippingPhone, &o.ShippingAddress, &o.ShippingCity, &o.ShippingState, &o.ShippingZIPCode)
			if err == nil {
				itemRows, itemErr := db.Query(`SELECT oi.product_id, oi.quantity, oi.price_at_qty, p.name 
					FROM order_items oi 
					JOIN products p ON oi.product_id = p.id 
					WHERE oi.order_id = $1`, o.ID)
				if itemErr == nil {
					var items []OrderItem
					for itemRows.Next() {
						var it OrderItem
						if scanErr := itemRows.Scan(&it.ProductID, &it.Quantity, &it.PriceAtQty, &it.ProductName); scanErr == nil {
							items = append(items, it)
						}
					}
					o.Items = items
					itemRows.Close()
				}
				orders = append(orders, o)
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func profileCouponsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-Id")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	userID := getAuthenticatedUserID(r)
	if userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	var email string
	err := db.QueryRow("SELECT email FROM profiles WHERE user_id = $1", userID).Scan(&email)
	if err != nil {
		if err == sql.ErrNoRows {
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode([]Coupon{})
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	coupons := []Coupon{}
	if email != "" {
		rows, err := db.Query(`SELECT id, code, type, value, min_order, expiry_date, is_active, usage_limit, used_count 
			FROM coupons WHERE owner_email = $1 ORDER BY id DESC`, email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		for rows.Next() {
			var c Coupon
			err = rows.Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.ExpiryDate, &c.IsActive, &c.UsageLimit, &c.UsedCount)
			if err == nil {
				coupons = append(coupons, c)
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(coupons)
}

func adminProfilesListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := db.Query(`SELECT user_id, email, full_name, phone, address, city, state, zip_code, preferred_size, style_notes, created_at, updated_at 
		FROM profiles ORDER BY full_name ASC`)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	list := []Profile{}
	for rows.Next() {
		var profile Profile
		err := rows.Scan(&profile.UserID, &profile.Email, &profile.FullName, &profile.Phone, &profile.Address, &profile.City, &profile.State, &profile.ZIPCode, &profile.PreferredSize, &profile.StyleNotes, &profile.CreatedAt, &profile.UpdatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		list = append(list, profile)
	}

	json.NewEncoder(w).Encode(list)
}

func adminProfileDetailsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "missing userId", http.StatusBadRequest)
		return
	}

	var profile Profile
	err := db.QueryRow(`SELECT user_id, email, full_name, phone, address, city, state, zip_code, preferred_size, style_notes, created_at, updated_at 
		FROM profiles WHERE user_id = $1`, userID).
		Scan(&profile.UserID, &profile.Email, &profile.FullName, &profile.Phone, &profile.Address, &profile.City, &profile.State, &profile.ZIPCode, &profile.PreferredSize, &profile.StyleNotes, &profile.CreatedAt, &profile.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "profile not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Fetch addresses
	addrRows, err := db.Query(`SELECT id, user_id, full_name, phone, address_line, city, state, zip_code, is_default, created_at, updated_at 
		FROM addresses WHERE user_id = $1 ORDER BY id DESC`, userID)
	addresses := []Address{}
	if err == nil {
		defer addrRows.Close()
		for addrRows.Next() {
			var addr Address
			err = addrRows.Scan(&addr.ID, &addr.UserID, &addr.FullName, &addr.Phone, &addr.AddressLine, &addr.City, &addr.State, &addr.ZIPCode, &addr.IsDefault, &addr.CreatedAt, &addr.UpdatedAt)
			if err == nil {
				addresses = append(addresses, addr)
			}
		}
	}

	// Fetch orders matching profile email
	orders := []Order{}
	if profile.Email != "" {
		orderRows, err := db.Query(`SELECT id, customer_email, total_amount, discount_amt, coupon_code, status, created_at, 
			COALESCE(razorpay_order_id, ''), COALESCE(razorpay_payment_id, ''), 
			COALESCE(tracking_number, ''), COALESCE(shipped_at, ''), COALESCE(unlocked_gift, ''),
			COALESCE(shipping_name, ''), COALESCE(shipping_phone, ''), COALESCE(shipping_address, ''),
			COALESCE(shipping_city, ''), COALESCE(shipping_state, ''), COALESCE(shipping_zip_code, '') FROM orders WHERE customer_email = $1 ORDER BY created_at DESC`, profile.Email)
		if err == nil {
			defer orderRows.Close()
			for orderRows.Next() {
				var o Order
				err = orderRows.Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt,
					&o.RazorpayOrderID, &o.RazorpayPaymentID, &o.TrackingNumber, &o.ShippedAt, &o.UnlockedGift,
					&o.ShippingName, &o.ShippingPhone, &o.ShippingAddress, &o.ShippingCity, &o.ShippingState, &o.ShippingZIPCode)
				if err == nil {
					// Fetch items for each order
					itemRows, itemErr := db.Query(`SELECT oi.product_id, oi.quantity, oi.price_at_qty, p.name 
						FROM order_items oi 
						JOIN products p ON oi.product_id = p.id 
						WHERE oi.order_id = $1`, o.ID)
					if itemErr == nil {
						var items []OrderItem
						for itemRows.Next() {
							var it OrderItem
							if scanErr := itemRows.Scan(&it.ProductID, &it.Quantity, &it.PriceAtQty, &it.ProductName); scanErr == nil {
								items = append(items, it)
							}
						}
						o.Items = items
						itemRows.Close()
					}
					orders = append(orders, o)
				}
			}
		}
	}

	// Fetch coupons matching profile email
	coupons := []Coupon{}
	if profile.Email != "" {
		couponRows, err := db.Query(`SELECT id, code, type, value, min_order, expiry_date, is_active, usage_limit, used_count 
			FROM coupons WHERE owner_email = $1 ORDER BY id DESC`, profile.Email)
		if err == nil {
			defer couponRows.Close()
			for couponRows.Next() {
				var c Coupon
				err = couponRows.Scan(&c.ID, &c.Code, &c.Type, &c.Value, &c.MinOrder, &c.ExpiryDate, &c.IsActive, &c.UsageLimit, &c.UsedCount)
				if err == nil {
					coupons = append(coupons, c)
				}
			}
		}
	}

	response := map[string]interface{}{
		"profile":   profile,
		"addresses": addresses,
		"orders":    orders,
		"coupons":   coupons,
	}

	json.NewEncoder(w).Encode(response)
}

func adminProfileEditHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload Profile
	r.Body = http.MaxBytesReader(w, r.Body, 32<<10)
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if payload.UserID == "" {
		http.Error(w, "userId is required", http.StatusBadRequest)
		return
	}

	payload.FullName = strings.TrimSpace(payload.FullName)
	payload.Phone = strings.TrimSpace(payload.Phone)
	payload.Address = strings.TrimSpace(payload.Address)
	payload.City = strings.TrimSpace(payload.City)
	payload.State = strings.TrimSpace(payload.State)
	payload.ZIPCode = strings.TrimSpace(payload.ZIPCode)

	if payload.FullName == "" || payload.Phone == "" || payload.Address == "" || payload.City == "" || payload.State == "" || payload.ZIPCode == "" {
		http.Error(w, "fullName, phone, address, city, state, and zipCode are required", http.StatusBadRequest)
		return
	}

	now := time.Now().UTC().Format(time.RFC3339)

	_, err := db.Exec(`
		UPDATE profiles SET
			full_name = $1,
			phone = $2,
			address = $3,
			city = $4,
			state = $5,
			zip_code = $6,
			preferred_size = $7,
			style_notes = $8,
			updated_at = $9
		WHERE user_id = $10
	`, payload.FullName, payload.Phone, payload.Address, payload.City, payload.State, payload.ZIPCode, payload.PreferredSize, payload.StyleNotes, now, payload.UserID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if payload.Address != "" && payload.City != "" && payload.State != "" && payload.ZIPCode != "" {
		var defID int
		err = db.QueryRow("SELECT id FROM addresses WHERE user_id = $1 AND is_default = TRUE", payload.UserID).Scan(&defID)
		if err == sql.ErrNoRows {
			_, err = db.Exec(`
				INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, zip_code, is_default, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8, $8)
			`, payload.UserID, payload.FullName, payload.Phone, payload.Address, payload.City, payload.State, payload.ZIPCode, now)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		} else if err == nil {
			_, err = db.Exec(`
				UPDATE addresses SET full_name = $1, phone = $2, address_line = $3, city = $4, state = $5, zip_code = $6, updated_at = $7
				WHERE id = $8
			`, payload.FullName, payload.Phone, payload.Address, payload.City, payload.State, payload.ZIPCode, now, defID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"profile updated successfully"}`))
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
	http.HandleFunc("/api/profile/me", profileMeHandler)
	http.HandleFunc("/api/profile/addresses", profileAddressesHandler)
	http.HandleFunc("/api/profile/orders", profileOrdersHandler)
	http.HandleFunc("/api/profile/coupons", profileCouponsHandler)

	// Protected Admin routes
	http.HandleFunc("/api/admin/coupons", adminAuthMiddleware(couponHandler))
	http.HandleFunc("/api/admin/orders", adminAuthMiddleware(ordersListHandler))
	http.HandleFunc("/api/admin/gift-tiers", adminAuthMiddleware(giftTiersUpdateHandler))
	http.HandleFunc("/api/admin/profiles", adminAuthMiddleware(adminProfilesListHandler))
	http.HandleFunc("/api/admin/profiles/details", adminAuthMiddleware(adminProfileDetailsHandler))
	http.HandleFunc("/api/admin/profiles/edit", adminAuthMiddleware(adminProfileEditHandler))

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
