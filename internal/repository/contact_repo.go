package repository

import (
	"database/sql"
	"ethnictouch/internal/models"
)

type ContactRepository interface {
	CreateMessage(msg *models.ContactMessage) error
	GetMessages() ([]models.ContactMessage, error)
	GetUnreadCount() (int, error)
	UpdateMessageStatus(id int, status string) error
}

type postgresContactRepo struct {
	db *sql.DB
}

func NewContactRepository(db *sql.DB) ContactRepository {
	return &postgresContactRepo{db: db}
}

func (r *postgresContactRepo) CreateMessage(msg *models.ContactMessage) error {
	err := r.db.QueryRow(`
		INSERT INTO contact_messages (name, email, phone, order_id, message, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id`,
		msg.Name, msg.Email, msg.Phone, msg.OrderID, msg.Message, msg.Status, msg.CreatedAt).Scan(&msg.ID)
	return err
}

func (r *postgresContactRepo) GetMessages() ([]models.ContactMessage, error) {
	rows, err := r.db.Query(`
		SELECT id, name, email, phone, order_id, message, status, created_at
		FROM contact_messages
		ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []models.ContactMessage
	for rows.Next() {
		var msg models.ContactMessage
		var phone, orderID sql.NullString
		if err := rows.Scan(&msg.ID, &msg.Name, &msg.Email, &phone, &orderID, &msg.Message, &msg.Status, &msg.CreatedAt); err != nil {
			return nil, err
		}
		msg.Phone = phone.String
		msg.OrderID = orderID.String
		messages = append(messages, msg)
	}
	return messages, nil
}

func (r *postgresContactRepo) GetUnreadCount() (int, error) {
	var count int
	err := r.db.QueryRow(`SELECT count(*) FROM contact_messages WHERE status = 'unread'`).Scan(&count)
	return count, err
}

func (r *postgresContactRepo) UpdateMessageStatus(id int, status string) error {
	_, err := r.db.Exec(`UPDATE contact_messages SET status = $1 WHERE id = $2`, status, id)
	return err
}
