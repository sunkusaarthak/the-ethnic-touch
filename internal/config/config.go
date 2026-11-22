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
	SuperAdminEmail   string
	PaymentProvider   string
	RazorpayKeyID     string
	RazorpayKeySecret string
	ShippingProvider  string

	// Email / SMTP Configuration
	GmailUser        string
	GmailAppPassword string
	EmailFromName    string
	EmailFromAddress string
	EmailReplyTo     string
	SMTPHost         string
	SMTPPort         string
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

	superAdminEmail := os.Getenv("SUPER_ADMIN_EMAIL")
	if superAdminEmail == "" {
		superAdminEmail = "admin@ethnictouch.com"
		log.Println("WARNING [SECURITY]: SUPER_ADMIN_EMAIL environment variable is not set! Using default: admin@ethnictouch.com")
	}

	paymentProvider := os.Getenv("PAYMENT_PROVIDER")
	if paymentProvider == "" {
		paymentProvider = "mock"
	}

	shippingProvider := os.Getenv("SHIPPING_PROVIDER")
	if shippingProvider == "" {
		shippingProvider = "mock"
	}

	gmailUser := os.Getenv("GMAIL_USER")
	gmailAppPassword := os.Getenv("GMAIL_APP_PASSWORD")

	emailFromName := os.Getenv("EMAIL_FROM_NAME")
	if emailFromName == "" {
		emailFromName = "The Ethnic Touch"
	}

	emailFromAddress := os.Getenv("EMAIL_FROM_ADDRESS")
	if emailFromAddress == "" {
		if gmailUser != "" {
			emailFromAddress = gmailUser
		} else {
			emailFromAddress = "orders@theethnictouch.com"
		}
	}

	emailReplyTo := os.Getenv("EMAIL_REPLY_TO")
	if emailReplyTo == "" {
		emailReplyTo = "theethnictouchsupport@gmail.com"
	}

	smtpHost := os.Getenv("SMTP_HOST")
	if smtpHost == "" {
		smtpHost = "smtp.gmail.com"
	}

	smtpPort := os.Getenv("SMTP_PORT")
	if smtpPort == "" {
		smtpPort = "465"
	}

	return &Config{
		DBHost:            host,
		DBPort:            port,
		DBUser:            user,
		DBPassword:        password,
		DBName:            dbname,
		DBSSLMode:         sslmode,
		SuperAdminEmail:   superAdminEmail,
		PaymentProvider:   paymentProvider,
		RazorpayKeyID:     os.Getenv("RAZORPAY_KEY_ID"),
		RazorpayKeySecret: os.Getenv("RAZORPAY_KEY_SECRET"),
		ShippingProvider:  shippingProvider,
		GmailUser:         gmailUser,
		GmailAppPassword:  gmailAppPassword,
		EmailFromName:     emailFromName,
		EmailFromAddress:  emailFromAddress,
		EmailReplyTo:      emailReplyTo,
		SMTPHost:          smtpHost,
		SMTPPort:          smtpPort,
	}
}
