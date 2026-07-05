package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

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
	ID           string    `json:"id"`
	Code         string    `json:"code"`
	Type         string    `json:"type"` // "fixed", "percentage"
	Value        float64   `json:"value"`
	MinOrder     float64   `json:"minOrder"`
	ExpiryDate   string    `json:"expiryDate"`
	IsActive     bool      `json:"isActive"`
	UsageLimit   int       `json:"usageLimit"`
	UsedCount    int       `json:"usedCount"`
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
	var err error
	db, err = sql.Open("sqlite", "./ethnictouch.db")
	if err != nil {
		log.Fatal("Failed to open db:", err)
	}

	queries := []string{
		`CREATE TABLE IF NOT EXISTS products (
			id TEXT PRIMARY KEY,
			name TEXT,
			description TEXT,
			price REAL,
			image_url TEXT,
			stock INTEGER DEFAULT 0,
			category TEXT
		);`,
		`CREATE TABLE IF NOT EXISTS coupons (
			id TEXT PRIMARY KEY,
			code TEXT UNIQUE,
			type TEXT,
			value REAL,
			min_order REAL,
			expiry_date TEXT,
			is_active BOOLEAN DEFAULT 1,
			usage_limit INTEGER,
			used_count INTEGER DEFAULT 0
		);`,
		`CREATE TABLE IF NOT EXISTS orders (
			id TEXT PRIMARY KEY,
			customer_email TEXT,
			total_amount REAL,
			discount_amt REAL,
			coupon_code TEXT,
			status TEXT,
			created_at TEXT
		);`,
	}

	for _, q := range queries {
		_, err = db.Exec(q)
		if err != nil {
			log.Fatal("Failed to create table:", err)
		}
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
	}

	// Seed a sample coupon if none exist
	var couponCount int
	db.QueryRow("SELECT COUNT(*) FROM coupons").Scan(&couponCount)
	if couponCount == 0 {
		db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit) VALUES ('c1', 'WELCOME10', 'percentage', 10, 1000, 100)")
		log.Println("Sample coupon WELCOME10 seeded successfully.")
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
		_, err := db.Exec("INSERT INTO products (id, name, description, price, image_url, stock, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
		_, err := db.Exec("INSERT INTO coupons (id, code, type, value, min_order, usage_limit) VALUES (?, ?, ?, ?, ?, ?, ?)",
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
	err := db.QueryRow("SELECT id, code, type, value, min_order, usage_limit, used_count FROM coupons WHERE code = ? AND is_active = 1", req.Code).
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
	_, err := db.Exec("INSERT INTO orders (id, customer_email, total_amount, discount_amt, coupon_code, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
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


func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/api/products", productsHandler)
	http.HandleFunc("/api/coupons/validate", couponValidateHandler)
	http.HandleFunc("/api/orders", orderCreateHandler)
	http.HandleFunc("/api/admin/coupons", couponHandler)
	http.HandleFunc("/api/admin/orders", ordersListHandler)

	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	log.Println("Server executing on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}




