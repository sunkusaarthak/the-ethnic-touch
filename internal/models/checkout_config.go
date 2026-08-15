package models

type CheckoutConfig struct {
	StandardDeliveryEnabled      bool `json:"standard_delivery_enabled"`
	HyderabadInstantEnabled      bool `json:"hyderabad_instant_enabled"`
	StorePickupPrepayEnabled     bool `json:"store_pickup_prepay_enabled"`
	StorePickupPayInStoreEnabled bool `json:"store_pickup_pay_in_store_enabled"`
}
