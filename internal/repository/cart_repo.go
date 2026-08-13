package repository

import (
	"database/sql"
	"ethnictouch/internal/models"
)

type CartItemResponse struct {
	ID          string  `json:"id"`
	CartID      int     `json:"cartId"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"imageUrl"`
	Quantity    int     `json:"quantity"`
	Size        string  `json:"size"`
}

type CartRepository interface {
	GetCart(userID string) ([]CartItemResponse, error)
	AddToCart(userID, productID string, quantity int, size string) error
	RemoveFromCart(userID, productID, size string) error
	ClearCart(userID string) error
	GetWishlist(userID string) ([]models.Product, error)
	AddToWishlist(userID, productID string) error
	RemoveFromWishlist(userID, productID string) error
	MergeWishlist(userID string, productIDs []string) error
}

type postgresCartRepo struct {
	db *sql.DB
}

func NewCartRepository(db *sql.DB) CartRepository {
	return &postgresCartRepo{db: db}
}

func (r *postgresCartRepo) GetCart(userID string) ([]CartItemResponse, error) {
	rows, err := r.db.Query(`
		SELECT p.id, c.id, p.name, p.description, p.price, COALESCE(p.image_url, ''), c.quantity, COALESCE(c.size, '')
		FROM cart_items c 
		JOIN products p ON c.product_id = p.id 
		WHERE c.user_id = $1 
		ORDER BY c.id ASC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []CartItemResponse
	for rows.Next() {
		var it CartItemResponse
		if err := rows.Scan(&it.ID, &it.CartID, &it.Name, &it.Description, &it.Price, &it.ImageURL, &it.Quantity, &it.Size); err == nil {
			items = append(items, it)
		}
	}
	return items, nil
}

func (r *postgresCartRepo) AddToCart(userID, productID string, quantity int, size string) error {
	_, err := r.db.Exec(`
		INSERT INTO cart_items (user_id, product_id, quantity, size, created_at)
		VALUES ($1, $2, $3, $4, NOW())
		ON CONFLICT (user_id, product_id, size) DO UPDATE SET quantity = EXCLUDED.quantity`,
		userID, productID, quantity, size)
	return err
}

func (r *postgresCartRepo) RemoveFromCart(userID, productID, size string) error {
	if size != "" {
		_, err := r.db.Exec(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 AND size = $3`, userID, productID, size)
		return err
	}
	_, err := r.db.Exec(`DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2`, userID, productID)
	return err
}

func (r *postgresCartRepo) ClearCart(userID string) error {
	_, err := r.db.Exec(`DELETE FROM cart_items WHERE user_id = $1`, userID)
	return err
}

func (r *postgresCartRepo) GetWishlist(userID string) ([]models.Product, error) {
	rows, err := r.db.Query(`
		SELECT p.id, p.name, p.description, p.price, COALESCE(p.image_url, ''), p.stock, COALESCE(p.category, '')
		FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = $1`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.ImageURL, &p.Stock, &p.Category); err == nil {
			products = append(products, p)
		}
	}
	return products, nil
}

func (r *postgresCartRepo) AddToWishlist(userID, productID string) error {
	_, err := r.db.Exec(`INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, userID, productID)
	return err
}

func (r *postgresCartRepo) RemoveFromWishlist(userID, productID string) error {
	_, err := r.db.Exec(`DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2`, userID, productID)
	return err
}

func (r *postgresCartRepo) MergeWishlist(userID string, productIDs []string) error {
	for _, pid := range productIDs {
		r.AddToWishlist(userID, pid)
	}
	return nil
}
