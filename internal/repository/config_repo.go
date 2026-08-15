package repository

import (
	"database/sql"
	"encoding/json"

	"ethnictouch/internal/models"
)

type ConfigRepository interface {
	GetSpinWheelConfig() (*models.SpinWheelConfig, error)
	UpdateSpinWheelConfig(config *models.SpinWheelConfig) error
	GetSpinWheelStats() (*models.SpinWheelStats, error)
	UpdateSpinWheelStats(stats *models.SpinWheelStats) error
	GetAuthConfig() (*models.AuthConfig, error)
	UpdateAuthConfig(config *models.AuthConfig) error
	GetCheckoutConfig() (*models.CheckoutConfig, error)
	UpdateCheckoutConfig(config *models.CheckoutConfig) error
}

type configRepository struct {
	db *sql.DB
}

func NewConfigRepository(db *sql.DB) ConfigRepository {
	return &configRepository{db: db}
}

func (r *configRepository) GetSpinWheelConfig() (*models.SpinWheelConfig, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'spin_wheel_config'").Scan(&val)
	if err != nil {
		return nil, err
	}

	var config models.SpinWheelConfig
	if err := json.Unmarshal([]byte(val), &config); err != nil {
		return nil, err
	}
	return &config, nil
}

func (r *configRepository) UpdateSpinWheelConfig(config *models.SpinWheelConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('spin_wheel_config', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func (r *configRepository) GetSpinWheelStats() (*models.SpinWheelStats, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'spin_wheel_stats'").Scan(&val)
	if err != nil {
		return nil, err
	}

	var stats models.SpinWheelStats
	if err := json.Unmarshal([]byte(val), &stats); err != nil {
		return nil, err
	}
	return &stats, nil
}

func (r *configRepository) UpdateSpinWheelStats(stats *models.SpinWheelStats) error {
	data, err := json.Marshal(stats)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('spin_wheel_stats', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func (r *configRepository) GetAuthConfig() (*models.AuthConfig, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'auth_config'").Scan(&val)
	if err == sql.ErrNoRows {
		// Default to true if not set yet
		return &models.AuthConfig{PhoneAuthEnabled: true}, nil
	}
	if err != nil {
		return nil, err
	}

	var config models.AuthConfig
	if err := json.Unmarshal([]byte(val), &config); err != nil {
		return nil, err
	}
	return &config, nil
}

func (r *configRepository) UpdateAuthConfig(config *models.AuthConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('auth_config', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func (r *configRepository) GetCheckoutConfig() (*models.CheckoutConfig, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'checkout_config'").Scan(&val)
	if err == sql.ErrNoRows {
		// Default to all enabled
		return &models.CheckoutConfig{
			StandardDeliveryEnabled:      true,
			HyderabadInstantEnabled:      true,
			StorePickupPrepayEnabled:     true,
			StorePickupPayInStoreEnabled: true,
		}, nil
	}
	if err != nil {
		return nil, err
	}

	var config models.CheckoutConfig
	if err := json.Unmarshal([]byte(val), &config); err != nil {
		return nil, err
	}
	return &config, nil
}

func (r *configRepository) UpdateCheckoutConfig(config *models.CheckoutConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('checkout_config', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}
