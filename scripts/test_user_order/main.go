package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"ethnictouch/internal/config"
	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
	_ "github.com/lib/pq"
)

func main() {
	cfg := config.LoadConfig()
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
			cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode)
	}
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	row := db.QueryRow(`SELECT id, customer_email, total_amount, discount_amt, COALESCE(coupon_code, ''), status, created_at, checkout_type, payment_method, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip_code, COALESCE(fulfilment_type, '') FROM orders WHERE id = $1`, "ORD_1795281014822")
	var o models.Order
	if err := row.Scan(&o.ID, &o.CustomerEmail, &o.TotalAmount, &o.DiscountAmt, &o.CouponCode, &o.Status, &o.CreatedAt, &o.CheckoutType, &o.PaymentMethod, &o.ShippingName, &o.ShippingPhone, &o.ShippingAddress, &o.ShippingCity, &o.ShippingState, &o.ShippingZIPCode, &o.FulfilmentType); err != nil {
		log.Fatal(err)
	}

	itemRows, err := db.Query(`SELECT oi.product_id, oi.quantity, oi.size, oi.price_at_qty, COALESCE(p.name, 'Jaipur Pure Cotton Kurti'), COALESCE(p.image_url, '') FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = $1`, o.ID)
	if err == nil {
		defer itemRows.Close()
		for itemRows.Next() {
			var it models.OrderItem
			if err := itemRows.Scan(&it.ProductID, &it.Quantity, &it.Size, &it.PriceAtQty, &it.ProductName, &it.ImageURL); err == nil {
				o.Items = append(o.Items, it)
			}
		}
	}

	emailSvc := service.NewEmailService(nil)
	err = emailSvc.SendOrderConfirmation(&o)
	if err != nil {
		log.Fatal(err)
	}

	previewHTML := emailSvc.SendOrderConfirmation(&o) // or test preview
	_ = previewHTML

	html, _, err := emailSvc.GeneratePreview("prepaid_pickup")
	if err == nil {
		_ = os.WriteFile("email_previews/user_order_1795281014822.html", []byte(html), 0644)
	}

	fmt.Printf("Successfully simulated email for order: %s, CheckoutType: %s, Status: %s\n", o.ID, o.CheckoutType, o.Status)
}
