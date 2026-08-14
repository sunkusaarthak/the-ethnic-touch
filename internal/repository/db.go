package repository

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"ethnictouch/internal/config"
	_ "github.com/lib/pq"
)

func InitDB(cfg *config.Config) (*sql.DB, error) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)
	log.Printf("Connecting to DB: host=%s port=%s user=%s dbname=%s sslmode=%s", cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBName, cfg.DBSSLMode)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open db: %w", err)
	}

	// Connection Pool Configuration
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)
	db.SetConnMaxIdleTime(3 * time.Minute)

	// Verify connection
	err = db.Ping()
	if err != nil {
		return nil, fmt.Errorf("failed to connect to db (Ping): %w", err)
	}

	if err := runMigrations(db); err != nil {
		return nil, fmt.Errorf("failed to run migrations: %w", err)
	}

	if err := seedData(db); err != nil {
		log.Printf("Warning: Seeding data failed: %v", err)
	}

	return db, nil
}

func runMigrations(db *sql.DB) error {
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
			physical_name TEXT,
			coupon_expiry_days INT DEFAULT 30
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
			spin_count INT DEFAULT 0,
			available_spins INT DEFAULT 0,
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
		`CREATE TABLE IF NOT EXISTS product_images (
			id SERIAL PRIMARY KEY,
			product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			image_url TEXT NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS product_reviews (
			id SERIAL PRIMARY KEY,
			product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			user_name TEXT NOT NULL,
			user_email TEXT NOT NULL,
			rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
			comment TEXT NOT NULL,
			created_at TEXT NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS wishlist (
			id SERIAL PRIMARY KEY,
			user_id TEXT NOT NULL,
			product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			created_at TEXT DEFAULT CURRENT_TIMESTAMP,
			UNIQUE(user_id, product_id)
		);`,
		`CREATE TABLE IF NOT EXISTS cart_items (
			id SERIAL PRIMARY KEY,
			user_id TEXT NOT NULL,
			product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
			quantity INT DEFAULT 1,
			size TEXT DEFAULT '',
			UNIQUE(user_id, product_id, size)
		);`,
		`CREATE TABLE IF NOT EXISTS system_config (
			key TEXT PRIMARY KEY,
			value TEXT NOT NULL
		);`,
	}

	for _, q := range queries {
		if _, err := db.Exec(q); err != nil {
			return err
		}
	}

	alterQueries := []string{
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes TEXT DEFAULT 'S,M,L,XL';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes_stock TEXT DEFAULT '{}';`,
		`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size TEXT DEFAULT '';`,
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
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS checkout_type TEXT DEFAULT 'delivery';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'online';`,
		`ALTER TABLE gift_tiers ADD COLUMN IF NOT EXISTS coupon_expiry_days INT DEFAULT 30;`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS collection TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS fabric TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS sleeve_type TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS neck_type TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS pattern TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS occasion TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '';`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2) DEFAULT 0;`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT FALSE;`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT FALSE;`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;`,
		`ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at TEXT DEFAULT '';`,
		`CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);`,
		`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);`,
		`CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);`,
		`CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);`,
		`CREATE INDEX IF NOT EXISTS idx_products_fabric ON products(fabric);`,
		`CREATE INDEX IF NOT EXISTS idx_products_color ON products(color);`,
		`CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON products(is_new_arrival);`,
		`CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);`,
		`CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);`,
		`CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);`,
		`CREATE INDEX IF NOT EXISTS idx_product_reviews_pid_rating ON product_reviews(product_id, rating);`,
		`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spin_count INT DEFAULT 0;`,
		`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS available_spins INT DEFAULT 0;`,
	}
	for _, q := range alterQueries {
		if _, err := db.Exec(q); err != nil {
			return err
		}
	}
	return nil
}

func seedData(db *sql.DB) error {
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
		
		_, err := db.Exec(`
		UPDATE products SET 
			collection = 'Festive Glow', fabric = 'Silk', color = 'Peach', 
			sleeve_type = 'Three Quarter', neck_type = 'Round', pattern = 'Embroidered', 
			occasion = 'Festival', sku = 'TET-ANK-001', tags = 'anarkali,silk,festive,peach,zari,wedding', 
			original_price = 14999.00, is_new_arrival = TRUE, is_best_seller = TRUE, is_featured = TRUE, 
			created_at = '2026-07-01T00:00:00Z' 
		WHERE id = '1';
		UPDATE products SET 
			collection = 'Summer Breeze', fabric = 'Cotton', color = 'Mint Green', 
			sleeve_type = 'Half Sleeve', neck_type = 'V Neck', pattern = 'Solid', 
			occasion = 'Daily Wear', sku = 'TET-STR-002', tags = 'straight,cotton,casual,mint,daily', 
			original_price = 6999.00, is_new_arrival = TRUE, is_best_seller = FALSE, is_featured = FALSE, 
			created_at = '2026-07-15T00:00:00Z' 
		WHERE id = '2';
		UPDATE products SET 
			collection = 'Lavender Dream', fabric = 'Georgette', color = 'Lavender', 
			sleeve_type = 'Sleeveless', neck_type = 'Round', pattern = 'Floral', 
			occasion = 'Party', sku = 'TET-TUN-003', tags = 'tunic,georgette,party,print,lavender', 
			original_price = 9999.00, is_new_arrival = FALSE, is_best_seller = TRUE, is_featured = TRUE, 
			created_at = '2026-07-10T00:00:00Z' 
		WHERE id = '3';
		`)
		if err != nil {
			log.Println("Error updating seeded products advanced features:", err)
		}
	}

	var couponCount int
	db.QueryRow("SELECT COUNT(*) FROM coupons").Scan(&couponCount)
	if couponCount == 0 {
		db.Exec(`INSERT INTO coupons (id, code, type, value, min_order, usage_limit, is_active) VALUES 
			('c1', 'WELCOME10', 'percentage', 10.0, 500.0, 1000, TRUE),
			('c2', 'ETHNIC10', 'percentage', 10.0, 500.0, 1000, TRUE),
			('c3', 'FESTIVE20', 'percentage', 20.0, 2000.0, 1000, TRUE),
			('c4', 'SAVE500', 'fixed', 500.0, 3000.0, 1000, TRUE)
			ON CONFLICT DO NOTHING`)
	}

	var tierCount int
	db.QueryRow("SELECT COUNT(*) FROM gift_tiers").Scan(&tierCount)
	if tierCount == 0 {
		seedTiers := `
		INSERT INTO gift_tiers (name, threshold, reward_type, discount_type, discount_value, coupon_format, physical_name) VALUES
		('Bronze Gift', 3000.00, 'physical', '', 0, '', 'Premium Leather Keychain'),
		('Silver Gift', 5000.00, 'coupon', 'percentage', 15.00, 'GFT-SLVR-[RAND]', ''),
		('Gold Gift', 10000.00, 'coupon', 'fixed', 2000.00, 'GFT-GOLD-[RAND]', '');
		`
		db.Exec(seedTiers)
	}

	var imgCount int
	db.QueryRow("SELECT COUNT(*) FROM product_images").Scan(&imgCount)
	if imgCount == 0 {
		seedImgQuery := `
		INSERT INTO product_images (product_id, image_url) VALUES
		('1', './images/kurthi_peach.png'),
		('1', './images/kurthi_blue.png'),
		('1', './images/kurthi_lavender.png'),
		('2', './images/kurthi_mint.png'),
		('2', './images/kurthi_blue.png'),
		('2', './images/kurthi_peach.png'),
		('3', './images/kurthi_lavender.png'),
		('3', './images/kurthi_peach.png'),
		('3', './images/kurthi_mint.png');
		`
		db.Exec(seedImgQuery)
	}

	var configCount int
	db.QueryRow("SELECT COUNT(*) FROM system_config WHERE key = 'spin_wheel_config'").Scan(&configCount)
	if configCount == 0 {
		defaultConfig := `{"enabled":true,"new_user_kurthi_threshold":50,"order_kurthi_threshold":100,"first_time_probs":{"prob_5_off":60,"prob_10_off":40,"prob_better_luck":0},"returning_probs":{"prob_5_off":20,"prob_10_off":5,"prob_better_luck":75}}`
		db.Exec("INSERT INTO system_config (key, value) VALUES ('spin_wheel_config', $1)", defaultConfig)
	}

	var statsCount int
	db.QueryRow("SELECT COUNT(*) FROM system_config WHERE key = 'spin_wheel_stats'").Scan(&statsCount)
	if statsCount == 0 {
		defaultStats := `{"new_users_since_last_kurthi":0,"orders_since_last_kurthi":0}`
		db.Exec("INSERT INTO system_config (key, value) VALUES ('spin_wheel_stats', $1)", defaultStats)
	}

	// Retroactively grant 1 spin to all existing users who have never spun and have 0 available spins
	db.Exec("UPDATE profiles SET available_spins = 1 WHERE spin_count = 0 AND available_spins = 0")

	return nil
}
