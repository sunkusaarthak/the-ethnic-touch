package models

// Profile represents customer user account details
type Profile struct {
	UserID        string `json:"userId"`
	Email         string `json:"email"`
	FullName      string `json:"fullName"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	City          string `json:"city"`
	State         string `json:"state"`
	ZIPCode       string `json:"zipCode"`
	PreferredSize string `json:"preferredSize,omitempty"`
	StyleNotes    string `json:"styleNotes,omitempty"`
	CreatedAt     string `json:"createdAt"`
	UpdatedAt     string `json:"updatedAt"`
}

// Address represents a saved shipping address for a user
type Address struct {
	ID          int    `json:"id"`
	UserID      string `json:"userId"`
	FullName    string `json:"fullName"`
	Phone       string `json:"phone"`
	AddressLine string `json:"addressLine"`
	City        string `json:"city"`
	State       string `json:"state"`
	ZIPCode     string `json:"zipCode"`
	IsDefault   bool   `json:"isDefault"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}
