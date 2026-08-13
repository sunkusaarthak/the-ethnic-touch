package service

import (
	"ethnictouch/internal/models"
	"testing"
)

type mockProfileRepo struct {
	profiles  map[string]*models.Profile
	addresses map[string][]models.Address
}

func newMockProfileRepo() *mockProfileRepo {
	return &mockProfileRepo{
		profiles:  make(map[string]*models.Profile),
		addresses: make(map[string][]models.Address),
	}
}

func (m *mockProfileRepo) GetProfile(userID string) (*models.Profile, error) {
	if p, ok := m.profiles[userID]; ok {
		return p, nil
	}
	return nil, models.ErrNotFound
}

func (m *mockProfileRepo) GetAllProfiles() ([]models.Profile, error) {
	var profiles []models.Profile
	for _, p := range m.profiles {
		profiles = append(profiles, *p)
	}
	return profiles, nil
}

func (m *mockProfileRepo) UpsertProfile(p *models.Profile) error {
	m.profiles[p.UserID] = p
	return nil
}

func (m *mockProfileRepo) GetAddresses(userID string) ([]models.Address, error) {
	return m.addresses[userID], nil
}

func (m *mockProfileRepo) CreateAddress(addr *models.Address) error {
	addrs := m.addresses[addr.UserID]
	if addr.IsDefault {
		for i := range addrs {
			addrs[i].IsDefault = false
		}
	}
	addr.ID = len(addrs) + 1
	addrs = append(addrs, *addr)
	m.addresses[addr.UserID] = addrs
	return nil
}

func (m *mockProfileRepo) SetDefaultAddress(userID string, addressID int) error {
	addrs := m.addresses[userID]
	for i := range addrs {
		addrs[i].IsDefault = (addrs[i].ID == addressID)
	}
	m.addresses[userID] = addrs
	return nil
}

func (m *mockProfileRepo) DeleteAddress(userID string, addressID int) error {
	addrs := m.addresses[userID]
	var updated []models.Address
	for _, a := range addrs {
		if a.ID != addressID {
			updated = append(updated, a)
		}
	}
	m.addresses[userID] = updated
	return nil
}

func (m *mockProfileRepo) IncrementSpinCount(userID string) error {
	if p, ok := m.profiles[userID]; ok {
		p.SpinCount++
	}
	return nil
}

func TestProfileService_SingleDefaultAddressInvariant(t *testing.T) {
	repo := newMockProfileRepo()
	svc := NewProfileService(repo)
	userID := "usr_default_addr_test"

	// Create address #1 as default
	svc.CreateAddress(&models.Address{
		UserID:      userID,
		FullName:    "First Address",
		AddressLine: "Line 1",
		IsDefault:   true,
	})

	// Create address #2 as default
	svc.CreateAddress(&models.Address{
		UserID:      userID,
		FullName:    "Second Address",
		AddressLine: "Line 2",
		IsDefault:   true,
	})

	addrs, _ := svc.GetAddresses(userID)
	if len(addrs) != 2 {
		t.Fatalf("Expected 2 addresses, got %d", len(addrs))
	}

	// Invariant: Address #1 should now be IsDefault = false
	if addrs[0].IsDefault {
		t.Errorf("Expected Address #1 to have IsDefault = false after creating Address #2 as default")
	}

	// Invariant: Address #2 should be IsDefault = true
	if !addrs[1].IsDefault {
		t.Errorf("Expected Address #2 to have IsDefault = true")
	}
}
