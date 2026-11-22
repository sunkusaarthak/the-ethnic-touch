package repository

import (
	"database/sql"
	"encoding/json"
	"errors"

	"ethnictouch/internal/models"
)

type SaleStore struct{ DB *sql.DB }

func (s SaleStore) Load() (models.Sale, error) {
	var sale models.Sale
	var raw string
	err := s.DB.QueryRow("SELECT value FROM system_config WHERE key = 'store_sale'").Scan(&raw)
	if errors.Is(err, sql.ErrNoRows) {
		return sale, nil
	}
	if err != nil {
		return sale, err
	}
	err = json.Unmarshal([]byte(raw), &sale)
	return sale, err
}

func (s SaleStore) Save(sale models.Sale) error {
	raw, err := json.Marshal(sale)
	if err != nil {
		return err
	}
	_, err = s.DB.Exec("INSERT INTO system_config (key, value) VALUES ('store_sale', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value", string(raw))
	return err
}
