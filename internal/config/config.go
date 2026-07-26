package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost            string
	DBPort            string
	DBUser            string
	DBPassword        string
	DBName            string
	DBSSLMode         string
	AdminAPIKey       string
	PaymentProvider   string
	RazorpayKeyID     string
	RazorpayKeySecret string
	ShippingProvider  string
}

func LoadConfig() *Config {
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

	adminKey := os.Getenv("ADMIN_API_KEY")
	if adminKey == "" {
		adminKey = "admin_secret_token_123"
		log.Println("WARNING [SECURITY]: ADMIN_API_KEY environment variable is not set! Using default key.")
	}

	paymentProvider := os.Getenv("PAYMENT_PROVIDER")
	if paymentProvider == "" {
		paymentProvider = "mock"
	}

	shippingProvider := os.Getenv("SHIPPING_PROVIDER")
	if shippingProvider == "" {
		shippingProvider = "mock"
	}

	return &Config{
		DBHost:            host,
		DBPort:            port,
		DBUser:            user,
		DBPassword:        password,
		DBName:            dbname,
		DBSSLMode:         sslmode,
		AdminAPIKey:       adminKey,
		PaymentProvider:   paymentProvider,
		RazorpayKeyID:     os.Getenv("RAZORPAY_KEY_ID"),
		RazorpayKeySecret: os.Getenv("RAZORPAY_KEY_SECRET"),
		ShippingProvider:  shippingProvider,
	}
}
