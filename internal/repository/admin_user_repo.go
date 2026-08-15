package repository

import (
	"database/sql"
	"ethnictouch/internal/models"
)

type AdminUserRepository interface {
	GetRoleByEmail(email string) (string, error)
	GetAllUsers() ([]models.AdminUser, error)
	AddUser(email, role string) error
	DeleteUser(email string) error
}

type postgresAdminUserRepo struct {
	db *sql.DB
}

func NewAdminUserRepository(db *sql.DB) AdminUserRepository {
	return &postgresAdminUserRepo{db: db}
}

func (r *postgresAdminUserRepo) GetRoleByEmail(email string) (string, error) {
	var role string
	err := r.db.QueryRow("SELECT role FROM admin_users WHERE email = $1", email).Scan(&role)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil // Not found
		}
		return "", err
	}
	return role, nil
}

func (r *postgresAdminUserRepo) GetAllUsers() ([]models.AdminUser, error) {
	rows, err := r.db.Query("SELECT email, role, created_at FROM admin_users ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []models.AdminUser
	for rows.Next() {
		var u models.AdminUser
		if err := rows.Scan(&u.Email, &u.Role, &u.CreatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func (r *postgresAdminUserRepo) AddUser(email, role string) error {
	_, err := r.db.Exec(`
		INSERT INTO admin_users (email, role) 
		VALUES ($1, $2) 
		ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
	`, email, role)
	return err
}

func (r *postgresAdminUserRepo) DeleteUser(email string) error {
	_, err := r.db.Exec("DELETE FROM admin_users WHERE email = $1", email)
	return err
}
