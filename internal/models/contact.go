package models

type ContactMessage struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	OrderID   string `json:"orderId"`
	Message   string `json:"message"`
	Status    string `json:"status"` // "unread", "read", "replied"
	CreatedAt string `json:"createdAt"`
}
