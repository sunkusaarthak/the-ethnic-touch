package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	_ "modernc.org/sqlite"
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
	ID           string  `json:"id"`
	Code         string  `json:"code"`
	Type         string  `json:"type"` // "fixed", "percentage"
	Value        float64 `json:"value"`
	MinOrder     float64 `json:"minOrder"`
	ExpiryDate   string  `json:"expiryDate"`
	IsActive     bool    `json:"isActive"`
	UsageLimit   int     `json:"usageLimit"`
	UsedCount    int     `json:"usedCount"`
	MaxDiscount  float64 `json:"maxDiscount,omitempty"`
	FreeShipping bool    `json:"freeShipping,omitempty"`
}

// Order represents a customer purchase
type Order struct {
	ID            string  `json:"id"`
	CustomerEmail string  `json:"customerEmail"`
	TotalAmount   float64 `json:"totalAmount"`
	DiscountAmt   float64 `json:"discountAmt"`
	CouponCode    string  `json:"couponCode"`
	Status        string  `json:"status"` // "pending", "paid", "shipped"
	CreatedAt     string  `json:"createdAt"`
}

type Profile struct {
	UserID        string `json:"userId"`
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

type CartItem struct {
	ProductID   string  `json:"productId"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	ImageURL    string  `json:"imageUrl"`
	Category    string  `json:"category"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unitPrice"`
	LineTotal   float64 `json:"lineTotal"`
	Stock       int     `json:"stock"`
}

type PriceSummary struct {
	ItemCount      int     `json:"itemCount"`
	Subtotal       float64 `json:"subtotal"`
	Shipping       float64 `json:"shipping"`
	Packaging      float64 `json:"packaging"`
	PlatformFee    float64 `json:"platformFee"`
	Tax            float64 `json:"tax"`
	CouponDiscount float64 `json:"couponDiscount"`
	OfferDiscount  float64 `json:"offerDiscount"`
	Savings        float64 `json:"savings"`
	Total          float64 `json:"total"`
	CouponCode     string  `json:"couponCode,omitempty"`
}

type CartResponse struct {
	Items      []CartItem   `json:"items"`
	SavedItems []CartItem   `json:"savedItems"`
	Summary    PriceSummary `json:"summary"`
	Warnings   []string     `json:"warnings,omitempty"`
}

type cartItemRequest struct {
	ProductID string `json:"productId"`
	Quantity  int    `json:"quantity"`
}

const (
	maxCartItemQuantity   = 10
	freeShippingThreshold = 5000.0
	standardShippingFee   = 99.0
	platformFee           = 10.0
	gstRate               = 0.05
)

var (
	profileNamePattern  = regexp.MustCompile(`^[A-Za-z][A-Za-z\s.'-]{1,79}$`)
	profilePhonePattern = regexp.MustCompile(`^\+?[0-9()\-\s]{8,15}$`)
	profileZIPPattern   = regexp.MustCompile(`^[A-Za-z0-9\-\s]{3,12}$`)
)

// Interfaces for Scalability
type PaymentProcessor interface {
	CreateSession(order Order) (string, error)
	VerifyWebhook(payload []byte, signature string) (bool, error)
}

type FileStorage interface {
	Upload(filename string, data []byte) (string, error)
	Delete(filename string) error
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

	if host == "" {
		host = "localhost"
	}
	if port == "" {
		port = "5432"
	}
	if user == "" {
		user = "postgres"
	}
	if dbname == "" {
		dbname = "ethnictouch"
	}
	if sslmode == "" {
		sslmode = "disable"
	}

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
		`CREATE TABLE IF NOT EXISTS profiles (
			user_id TEXT PRIMARY KEY,
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
		`CREATE TABLE IF NOT EXISTS carts (
			user_id TEXT PRIMARY KEY,
			coupon_code TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS cart_items (
			user_id TEXT NOT NULL,
			product_id TEXT NOT NULL,
			quantity INTEGER NOT NULL CHECK (quantity > 0),
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			PRIMARY KEY (user_id, product_id)
		);`,
		`CREATE TABLE IF NOT EXISTS saved_cart_items (
			user_id TEXT NOT NULL,
			product_id TEXT NOT NULL,
			quantity INTEGER NOT NULL CHECK (quantity > 0),
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL,
			PRIMARY KEY (user_id, product_id)
		);`,
		`CREATE TABLE IF NOT EXISTS coupon_redemptions (
			user_id TEXT NOT NULL,
			coupon_code TEXT NOT NULL,
			order_id TEXT NOT NULL,
			created_at TEXT NOT NULL,
			PRIMARY KEY (user_id, coupon_code, order_id)
		);`,
	}

	for _, q := range queries {
		_, err = db.Exec(q)
		if err != nil {
			log.Fatal("Failed to create table:", err)
		}
	}
	migrateSchema()

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
	}

	// Seed a sample coupon if none exist
	var couponCount int
	db.QueryRow("SELECT COUNT(*) FROM coupons").Scan(&couponCount)
	if couponCount == 0 {
		db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit) VALUES ('c1', 'WELCOME10', 'percentage', 10, 1000, 100)")
		log.Println("Sample coupon WELCOME10 seeded successfully.")
	}
}

func columnExists(table, column string) (bool, error) {
	rows, err := db.Query(fmt.Sprintf("PRAGMA table_info(%s)", table))
	if err != nil {
		return false, err
	}
	defer rows.Close()
	for rows.Next() {
		var cid int
		var name, dataType string
		var notNull, primaryKey int
		var defaultValue any
		if err := rows.Scan(&cid, &name, &dataType, &notNull, &defaultValue, &primaryKey); err != nil {
			return false, err
		}
		if name == column {
			return true, nil
		}
	}
	return false, rows.Err()
}

func ensureColumn(table, column, definition string) bool {
	exists, err := columnExists(table, column)
	if err != nil {
		log.Fatal("Failed to inspect schema:", err)
	}
	if exists {
		return false
	}
	if _, err := db.Exec(fmt.Sprintf("ALTER TABLE %s ADD COLUMN %s %s", table, column, definition)); err != nil {
		log.Fatal("Failed to migrate schema:", err)
	}
	return true
}

func migrateSchema() {
	// Earlier local databases predate stock/category columns. Keep those records
	// purchasable after this additive migration instead of silently treating them
	// as unavailable.
	if ensureColumn("products", "stock", "INTEGER NOT NULL DEFAULT 0") {
		if _, err := db.Exec("UPDATE products SET stock = 10"); err != nil {
			log.Fatal("Failed to backfill product stock:", err)
		}
	}
	ensureColumn("products", "category", "TEXT NOT NULL DEFAULT ''")
	ensureColumn("products", "is_active", "BOOLEAN NOT NULL DEFAULT 1")
	ensureColumn("products", "brand", "TEXT NOT NULL DEFAULT ''")

	ensureColumn("coupons", "max_discount", "REAL NOT NULL DEFAULT 0")
	ensureColumn("coupons", "per_user_limit", "INTEGER NOT NULL DEFAULT 1")
	ensureColumn("coupons", "applicable_categories", "TEXT NOT NULL DEFAULT ''")
	ensureColumn("coupons", "applicable_products", "TEXT NOT NULL DEFAULT ''")
	ensureColumn("coupons", "applicable_users", "TEXT NOT NULL DEFAULT ''")
	ensureColumn("coupons", "free_shipping", "BOOLEAN NOT NULL DEFAULT 0")
	ensureColumn("coupons", "combinable", "BOOLEAN NOT NULL DEFAULT 0")

	ensureColumn("orders", "user_id", "TEXT NOT NULL DEFAULT ''")
	ensureColumn("orders", "subtotal", "REAL NOT NULL DEFAULT 0")
	ensureColumn("orders", "shipping_amount", "REAL NOT NULL DEFAULT 0")
	ensureColumn("orders", "packaging_amount", "REAL NOT NULL DEFAULT 0")
	ensureColumn("orders", "platform_fee", "REAL NOT NULL DEFAULT 0")
	ensureColumn("orders", "tax_amount", "REAL NOT NULL DEFAULT 0")
	ensureColumn("orders", "total_items", "INTEGER NOT NULL DEFAULT 0")
	ensureColumn("orders", "shipping_address", "TEXT NOT NULL DEFAULT ''")

	indexes := []string{
		"CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id)",
		"CREATE INDEX IF NOT EXISTS idx_saved_cart_items_user ON saved_cart_items(user_id)",
		"CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_user_coupon ON coupon_redemptions(user_id, coupon_code)",
		"CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)",
	}
	for _, query := range indexes {
		if _, err := db.Exec(query); err != nil {
			log.Fatal("Failed to create index:", err)
		}
	}
}

// Handlers
func productsHandler(w http.ResponseWriter, r *http.Request) {
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
		w.Header().Set("Access-Control-Allow-Origin", "*")
		json.NewEncoder(w).Encode(products)
	} else if r.Method == "POST" {
		var p Product
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// In a real app, generate a unique ID
		p.ID = "p_" + p.Name[:2] // Simple mock ID
		_, err := db.Exec("INSERT INTO products (id, name, description, price, image_url, stock, category) VALUES ($1, $2, $3, $4, $5, $6, $7)",
			p.ID, p.Name, p.Description, p.Price, p.ImageURL, p.Stock, p.Category)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(p)
	}
}

func couponHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var c Coupon
		if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		c.ID = "c_" + c.Code
		_, err := db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit) VALUES ($1, $2, $3, $4, $5, $6)",
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
			c.IsActive = true // Basic mock for isActive
			coupons = append(coupons, c)
		}
		json.NewEncoder(w).Encode(coupons)
	}
}

func ordersListHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT id, customer_email, total_amount, discount_amt, coupon_code, status, created_at FROM orders")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	var orders []Order
	for rows.Next() {
		var o Order
		rows.Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt)
		orders = append(orders, o)
	}
	json.NewEncoder(w).Encode(orders)
}

func couponValidateHandler(w http.ResponseWriter, r *http.Request) {
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
		http.Error(w, "Invalid or expired coupon", http.StatusNotFound)
		return
	}
	if req.Total < c.MinOrder {
		http.Error(w, fmt.Sprintf("Minimum order of ₹%.2f required", c.MinOrder), http.StatusBadRequest)
		return
	}
	if c.UsageLimit > 0 && c.UsedCount >= c.UsageLimit {
		http.Error(w, "Coupon usage limit reached", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func orderCreateHandler(w http.ResponseWriter, r *http.Request) {
	var o Order
	if err := json.NewDecoder(r.Body).Decode(&o); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	o.ID = "ORD_" + fmt.Sprint(time.Now().Unix())
	o.Status = "pending"
	o.CreatedAt = time.Now().Format(time.RFC3339)
	_, err := db.Exec("INSERT INTO orders (id, customer_email, total_amount, discount_amt, coupon_code, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		o.ID, o.CustomerEmail, o.TotalAmount, o.DiscountAmt, o.CouponCode, o.Status, o.CreatedAt)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if o.TotalAmount > 5000 {
		giftCode := "GFT-" + o.ID[4:8]
		log.Printf("[GIFT SYSTEM] Generated 15%% discount for %s: %s", o.CustomerEmail, giftCode)
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(o)
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
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
	userID := getAuthenticatedUserID(r)
	if userID == "" {
		http.Error(w, "authentication required", http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodGet:
		var profile Profile
		err := db.QueryRow("SELECT user_id, full_name, phone, address, city, state, zip_code, preferred_size, style_notes, created_at, updated_at FROM profiles WHERE user_id = ?", userID).
			Scan(&profile.UserID, &profile.FullName, &profile.Phone, &profile.Address, &profile.City, &profile.State, &profile.ZIPCode, &profile.PreferredSize, &profile.StyleNotes, &profile.CreatedAt, &profile.UpdatedAt)
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
		// Continue below. Both methods are idempotent upserts so a retried save
		// cannot create a second profile for this user.
	default:
		w.Header().Set("Allow", "GET, POST, PATCH")
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

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
	existingErr := db.QueryRow("SELECT created_at FROM profiles WHERE user_id = ?", userID).Scan(&existingCreatedAt)
	if existingErr == nil {
		createdAt = existingCreatedAt
	} else if existingErr != sql.ErrNoRows {
		http.Error(w, existingErr.Error(), http.StatusInternalServerError)
		return
	}

	_, err := db.Exec(`
			INSERT INTO profiles (user_id, full_name, phone, address, city, state, zip_code, preferred_size, style_notes, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(user_id) DO UPDATE SET
				full_name = excluded.full_name,
				phone = excluded.phone,
				address = excluded.address,
				city = excluded.city,
				state = excluded.state,
				zip_code = excluded.zip_code,
				preferred_size = excluded.preferred_size,
				style_notes = excluded.style_notes,
				updated_at = excluded.updated_at
	`, userID, payload.FullName, payload.Phone, payload.Address, payload.City, payload.State, payload.ZIPCode, payload.PreferredSize, payload.StyleNotes, createdAt, now)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	if existingErr == sql.ErrNoRows {
		w.WriteHeader(http.StatusCreated)
	}
	json.NewEncoder(w).Encode(Profile{UserID: userID, FullName: payload.FullName, Phone: payload.Phone, Address: payload.Address, City: payload.City, State: payload.State, ZIPCode: payload.ZIPCode, PreferredSize: payload.PreferredSize, StyleNotes: payload.StyleNotes, CreatedAt: createdAt, UpdatedAt: now})
}

func listenOnPort() net.Listener {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	listener, err := net.Listen("tcp", "127.0.0.1:"+port)
	if err != nil {
		log.Fatal(err)
	}
	return listener
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/products", productsHandler)
	http.HandleFunc("/api/coupons/validate", couponValidateHandler)
	http.HandleFunc("/api/orders", orderCreateHandler)
	http.HandleFunc("/api/admin/coupons", couponHandler)
	http.HandleFunc("/api/admin/orders", ordersListHandler)
	http.HandleFunc("/api/profile/me", profileMeHandler)

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	listener := listenOnPort()
	addr := listener.Addr().String()
	log.Printf("Server executing on http://%s", addr)
	log.Fatal(http.Serve(listener, nil))
}
