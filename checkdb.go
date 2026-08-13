package main
import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "postgres://avnadmin:DB_PASSWORD@pg-2c0401a2-sunku.h.aivencloud.com:15163/defaultdb?sslmode=require")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	
	userID := "test-user-id"
	// Get a real product ID to avoid foreign key violation
	var productID string
	err = db.QueryRow("SELECT id FROM products LIMIT 1").Scan(&productID)
	if err != nil {
		log.Fatal(err)
	}
	quantity := 2
	size := ""

	_, err = db.Exec(`
		INSERT INTO cart_items (user_id, product_id, quantity, size, created_at)
		VALUES ($1, $2, $3, $4, NOW())
		ON CONFLICT (user_id, product_id, size) DO UPDATE SET quantity = EXCLUDED.quantity`,
		userID, productID, quantity, size)
	
	if err != nil {
		fmt.Println("DB ERROR:", err)
	} else {
		fmt.Println("SUCCESS")
	}
}
