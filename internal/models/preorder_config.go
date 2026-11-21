package models

// PreorderPickupConfig holds the admin-configurable store pickup settings for preorder campaigns.
// Stored as JSON in system_config table under key 'preorder_pickup_config'.
type PreorderPickupConfig struct {
	Enabled             bool   `json:"enabled"`
	LocationName        string `json:"locationName"`
	Address             string `json:"address"`
	City                string `json:"city"`
	State               string `json:"state"`
	ZipCode             string `json:"zipCode"`
	MapsLink            string `json:"mapsLink"`
	Instructions        string `json:"instructions"`
	Availability        string `json:"availability"`
	ContactInfo         string `json:"contactInfo"`
	EstimatedPickupDate string `json:"estimatedPickupDate"`
	CollectionDeadline  string `json:"collectionDeadline"`
}

// PreorderPickupAuditEntry records a pickup status change or admin action.
type PreorderPickupAuditEntry struct {
	ID          int    `json:"id"`
	OrderID     string `json:"orderId"`
	Action      string `json:"action"`
	PerformedBy string `json:"performedBy"`
	PerformedAt string `json:"performedAt"`
	Notes       string `json:"notes"`
}

// Fulfilment type constants for preorder orders.
const (
	FulfilmentTypePreorderHomeDelivery = "PREORDER_HOME_DELIVERY"
	FulfilmentTypePreorderStorePickup  = "PREORDER_STORE_PICKUP"
)

// Preorder pickup status constants (stored in orders.status).
const (
	PreorderStatusProduction     = "preorder_production"
	PreorderStatusQualityCheck   = "preorder_quality_check"
	PreorderStatusReadyForPickup = "READY_FOR_PICKUP"
	PreorderStatusCollected      = "COLLECTED"
	PreorderStatusPickupExpired  = "PICKUP_EXPIRED"
	PreorderStatusAwaitingPickup = "AWAITING_PICKUP"
)

