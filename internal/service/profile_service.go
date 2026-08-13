package service

import (
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

type ProfileService interface {
	GetProfile(userID string) (*models.Profile, error)
	GetAllProfiles() ([]models.Profile, error)
	UpsertProfile(p *models.Profile) error
	GetAddresses(userID string) ([]models.Address, error)
	CreateAddress(addr *models.Address) error
	SetDefaultAddress(userID string, addressID int) error
	DeleteAddress(userID string, addressID int) error
}

type profileService struct {
	repo repository.ProfileRepository
}

func NewProfileService(repo repository.ProfileRepository) ProfileService {
	return &profileService{repo: repo}
}

func (s *profileService) GetProfile(userID string) (*models.Profile, error) {
	return s.repo.GetProfile(userID)
}

func (s *profileService) GetAllProfiles() ([]models.Profile, error) {
	return s.repo.GetAllProfiles()
}

func (s *profileService) UpsertProfile(p *models.Profile) error {
	now := time.Now().Format(time.RFC3339)
	if p.CreatedAt == "" {
		p.CreatedAt = now
	}
	p.UpdatedAt = now
	return s.repo.UpsertProfile(p)
}

func (s *profileService) GetAddresses(userID string) ([]models.Address, error) {
	return s.repo.GetAddresses(userID)
}

func (s *profileService) CreateAddress(addr *models.Address) error {
	now := time.Now().Format(time.RFC3339)
	addr.CreatedAt = now
	addr.UpdatedAt = now
	return s.repo.CreateAddress(addr)
}

func (s *profileService) SetDefaultAddress(userID string, addressID int) error {
	return s.repo.SetDefaultAddress(userID, addressID)
}

func (s *profileService) DeleteAddress(userID string, addressID int) error {
	return s.repo.DeleteAddress(userID, addressID)
}
