package service

import (
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

type ConfigService interface {
	GetSpinWheelConfig() (*models.SpinWheelConfig, error)
	UpdateSpinWheelConfig(config *models.SpinWheelConfig) error
	GetSpinWheelStats() (*models.SpinWheelStats, error)
	
	IncrementNewUserKurthiCounter() error
	IncrementOrderKurthiCounter() error
	ResetNewUserKurthiCounter() error
	ResetOrderKurthiCounter() error

	GetAuthConfig() (*models.AuthConfig, error)
	UpdateAuthConfig(config *models.AuthConfig) error

	GetCheckoutConfig() (*models.CheckoutConfig, error)
	UpdateCheckoutConfig(config *models.CheckoutConfig) error
}

type configService struct {
	repo repository.ConfigRepository
}

func NewConfigService(repo repository.ConfigRepository) ConfigService {
	return &configService{repo: repo}
}

func (s *configService) GetSpinWheelConfig() (*models.SpinWheelConfig, error) {
	return s.repo.GetSpinWheelConfig()
}

func (s *configService) UpdateSpinWheelConfig(config *models.SpinWheelConfig) error {
	return s.repo.UpdateSpinWheelConfig(config)
}

func (s *configService) GetSpinWheelStats() (*models.SpinWheelStats, error) {
	return s.repo.GetSpinWheelStats()
}

func (s *configService) IncrementNewUserKurthiCounter() error {
	stats, err := s.repo.GetSpinWheelStats()
	if err != nil {
		return err
	}
	stats.NewUsersSinceLastKurthi++
	return s.repo.UpdateSpinWheelStats(stats)
}

func (s *configService) IncrementOrderKurthiCounter() error {
	stats, err := s.repo.GetSpinWheelStats()
	if err != nil {
		return err
	}
	stats.OrdersSinceLastKurthi++
	return s.repo.UpdateSpinWheelStats(stats)
}

func (s *configService) ResetNewUserKurthiCounter() error {
	stats, err := s.repo.GetSpinWheelStats()
	if err != nil {
		return err
	}
	stats.NewUsersSinceLastKurthi = 0
	return s.repo.UpdateSpinWheelStats(stats)
}

func (s *configService) ResetOrderKurthiCounter() error {
	stats, err := s.repo.GetSpinWheelStats()
	if err != nil {
		return err
	}
	stats.OrdersSinceLastKurthi = 0
	return s.repo.UpdateSpinWheelStats(stats)
}

func (s *configService) GetAuthConfig() (*models.AuthConfig, error) {
	return s.repo.GetAuthConfig()
}

func (s *configService) UpdateAuthConfig(config *models.AuthConfig) error {
	return s.repo.UpdateAuthConfig(config)
}

func (s *configService) GetCheckoutConfig() (*models.CheckoutConfig, error) {
	return s.repo.GetCheckoutConfig()
}

func (s *configService) UpdateCheckoutConfig(config *models.CheckoutConfig) error {
	return s.repo.UpdateCheckoutConfig(config)
}
