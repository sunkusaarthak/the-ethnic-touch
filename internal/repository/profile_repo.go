package repository

import (
	"database/sql"
	"ethnictouch/internal/models"
)

type ProfileRepository interface {
	GetProfile(userID string) (*models.Profile, error)
	GetAllProfiles() ([]models.Profile, error)
	UpsertProfile(p *models.Profile) error
	GetAddresses(userID string) ([]models.Address, error)
	CreateAddress(addr *models.Address) error
	SetDefaultAddress(userID string, addressID int) error
	DeleteAddress(userID string, addressID int) error
	IncrementSpinCount(userID string) error
	AddSpinTicket(userID string, count int) error
	ConsumeSpinTicket(userID string) error
	DeleteProfile(userID string) error
}

type postgresProfileRepo struct {
	db *sql.DB
}

func NewProfileRepository(db *sql.DB) ProfileRepository {
	return &postgresProfileRepo{db: db}
}

func (r *postgresProfileRepo) GetProfile(userID string) (*models.Profile, error) {
	var p models.Profile
	err := r.db.QueryRow(`
		SELECT user_id, COALESCE(email, ''), full_name, phone, address, city, state, zip_code, 
		COALESCE(preferred_size, ''), COALESCE(style_notes, ''), spin_count, available_spins, created_at, updated_at
		FROM profiles WHERE user_id = $1`, userID).
		Scan(&p.UserID, &p.Email, &p.FullName, &p.Phone, &p.Address, &p.City, &p.State, &p.ZIPCode,
			&p.PreferredSize, &p.StyleNotes, &p.SpinCount, &p.AvailableSpins, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *postgresProfileRepo) GetAllProfiles() ([]models.Profile, error) {
	rows, err := r.db.Query(`
		SELECT user_id, COALESCE(email, ''), COALESCE(full_name, ''), COALESCE(phone, ''), 
		COALESCE(address, ''), COALESCE(city, ''), COALESCE(state, ''), COALESCE(zip_code, ''), 
		COALESCE(preferred_size, ''), COALESCE(style_notes, ''), spin_count, available_spins, COALESCE(created_at, ''), COALESCE(updated_at, '')
		FROM profiles ORDER BY updated_at DESC`)
	if err != nil {
		return []models.Profile{}, nil
	}
	defer rows.Close()

	profiles := []models.Profile{}
	for rows.Next() {
		var p models.Profile
		if err := rows.Scan(&p.UserID, &p.Email, &p.FullName, &p.Phone, &p.Address, &p.City, &p.State, &p.ZIPCode,
			&p.PreferredSize, &p.StyleNotes, &p.SpinCount, &p.AvailableSpins, &p.CreatedAt, &p.UpdatedAt); err == nil {
			profiles = append(profiles, p)
		}
	}
	if profiles == nil {
		profiles = []models.Profile{}
	}
	return profiles, nil
}

func (r *postgresProfileRepo) UpsertProfile(p *models.Profile) error {
	// Identity Validation
	var existingEmailUserID, existingPhoneUserID sql.NullString
	
	rows, err := r.db.Query(`
		SELECT user_id, email, phone FROM profiles 
		WHERE (email = $1 AND email != '') OR (phone = $2 AND phone != '')`, p.Email, p.Phone)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var uid, email, phone string
		if err := rows.Scan(&uid, &email, &phone); err != nil {
			return err
		}
		if uid != p.UserID {
			if email == p.Email {
				existingEmailUserID.String = uid
				existingEmailUserID.Valid = true
			}
			if phone == p.Phone {
				existingPhoneUserID.String = uid
				existingPhoneUserID.Valid = true
			}
		}
	}
	if err := rows.Err(); err != nil {
		return err
	}

	if existingEmailUserID.Valid && existingPhoneUserID.Valid && existingEmailUserID.String != existingPhoneUserID.String {
		return models.ErrIdentityConflict
	}
	if existingEmailUserID.Valid {
		return models.ErrEmailAlreadyRegistered
	}
	if existingPhoneUserID.Valid {
		return models.ErrMobileAlreadyRegistered
	}

	_, err = r.db.Exec(`
		INSERT INTO profiles (user_id, email, full_name, phone, address, city, state, zip_code, preferred_size, style_notes, spin_count, available_spins, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		ON CONFLICT (user_id) DO UPDATE SET
			email = EXCLUDED.email,
			full_name = EXCLUDED.full_name,
			phone = EXCLUDED.phone,
			address = EXCLUDED.address,
			city = EXCLUDED.city,
			state = EXCLUDED.state,
			zip_code = EXCLUDED.zip_code,
			preferred_size = EXCLUDED.preferred_size,
			style_notes = EXCLUDED.style_notes,
			available_spins = EXCLUDED.available_spins,
			updated_at = EXCLUDED.updated_at`,
		p.UserID, p.Email, p.FullName, p.Phone, p.Address, p.City, p.State, p.ZIPCode,
		p.PreferredSize, p.StyleNotes, p.SpinCount, p.AvailableSpins, p.CreatedAt, p.UpdatedAt)
	return err
}

func (r *postgresProfileRepo) GetAddresses(userID string) ([]models.Address, error) {
	rows, err := r.db.Query(`
		SELECT id, user_id, full_name, phone, address_line, city, state, zip_code, is_default, created_at, updated_at
		FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var addresses []models.Address
	for rows.Next() {
		var a models.Address
		if err := rows.Scan(&a.ID, &a.UserID, &a.FullName, &a.Phone, &a.AddressLine, &a.City, &a.State, &a.ZIPCode, &a.IsDefault, &a.CreatedAt, &a.UpdatedAt); err == nil {
			addresses = append(addresses, a)
		}
	}
	return addresses, nil
}

func (r *postgresProfileRepo) CreateAddress(addr *models.Address) error {
	if addr.IsDefault {
		r.db.Exec(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, addr.UserID)
	}

	err := r.db.QueryRow(`
		INSERT INTO addresses (user_id, full_name, phone, address_line, city, state, zip_code, is_default, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
		addr.UserID, addr.FullName, addr.Phone, addr.AddressLine, addr.City, addr.State, addr.ZIPCode, addr.IsDefault, addr.CreatedAt, addr.UpdatedAt).
		Scan(&addr.ID)
	return err
}

func (r *postgresProfileRepo) SetDefaultAddress(userID string, addressID int) error {
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	_, err = tx.Exec(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, userID)
	if err != nil {
		return err
	}

	_, err = tx.Exec(`UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2`, addressID, userID)
	if err != nil {
		return err
	}

	// Also sync default address to main profile
	var addr models.Address
	err = tx.QueryRow(`SELECT full_name, phone, address_line, city, state, zip_code FROM addresses WHERE id = $1 AND user_id = $2`, addressID, userID).
		Scan(&addr.FullName, &addr.Phone, &addr.AddressLine, &addr.City, &addr.State, &addr.ZIPCode)
	if err == nil {
		tx.Exec(`UPDATE profiles SET full_name = $1, phone = $2, address = $3, city = $4, state = $5, zip_code = $6 WHERE user_id = $7`,
			addr.FullName, addr.Phone, addr.AddressLine, addr.City, addr.State, addr.ZIPCode, userID)
	}

	return tx.Commit()
}

func (r *postgresProfileRepo) DeleteAddress(userID string, addressID int) error {
	_, err := r.db.Exec(`DELETE FROM addresses WHERE id = $1 AND user_id = $2`, addressID, userID)
	return err
}

func (r *postgresProfileRepo) IncrementSpinCount(userID string) error {
	_, err := r.db.Exec(`UPDATE profiles SET spin_count = spin_count + 1 WHERE user_id = $1`, userID)
	return err
}

func (r *postgresProfileRepo) AddSpinTicket(userID string, count int) error {
	_, err := r.db.Exec(`UPDATE profiles SET available_spins = available_spins + $1 WHERE user_id = $2`, count, userID)
	return err
}

func (r *postgresProfileRepo) ConsumeSpinTicket(userID string) error {
	_, err := r.db.Exec(`UPDATE profiles SET available_spins = available_spins - 1, spin_count = spin_count + 1 WHERE user_id = $1 AND available_spins > 0`, userID)
	return err
}

func (r *postgresProfileRepo) DeleteProfile(userID string) error {
	// First delete related records if any, then delete profile
	// Assuming cascade on DB side, or we can just delete from profiles directly
	_, err := r.db.Exec(`DELETE FROM profiles WHERE user_id = $1`, userID)
	return err
}
