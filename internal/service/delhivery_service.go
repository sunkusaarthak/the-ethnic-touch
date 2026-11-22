package service

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"ethnictouch/internal/models"
)

type ShipmentBookingResult struct {
	Success        bool   `json:"success"`
	Rejected       bool   `json:"rejected"`
	TrackingNumber string `json:"trackingNumber"`
	Remarks        string `json:"remarks"`
}

type DelhiveryService interface {
	CheckServiceability(pincode string, weightGrams int) (bool, float64, error)
	BatchPickup(orders []models.Order) (map[string]ShipmentBookingResult, error)
	ValidateWebhookSignature(payload []byte, signature string) bool
	ValidateWebhookToken(token string) bool
	FetchTracking(ctx context.Context, waybills []string) (map[string][]models.ShipmentEvent, error)
}

type liveDelhiveryService struct {
	webhookSecret string
	apiKey        string
	mock          bool
}

var ErrCarrierNotConfigured = errors.New("delivery carrier credentials are missing")
var ErrDeliveryNotServiceable = errors.New("delivery is unavailable for this address")

func NewDelhiveryService(secret, apiKey, provider string) DelhiveryService {
	return &liveDelhiveryService{
		webhookSecret: secret,
		apiKey:        strings.TrimSpace(apiKey),
		mock:          provider == "mock",
	}
}

func (s *liveDelhiveryService) CheckServiceability(pincode string, weightGrams int) (bool, float64, error) {
	if s.mock {
		if pincode == "999999" || pincode == "000000" {
			return false, 0, nil
		}
		if pincode == "999998" {
			return false, 0, fmt.Errorf("carrier timeout connecting to Delhivery API")
		}
		return true, 59.0, nil
	}
	if s.apiKey == "" {
		return false, 0, ErrCarrierNotConfigured
	}

	url := fmt.Sprintf("https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=%s", pincode)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false, 0, err
	}
	req.Header.Set("Authorization", "Token "+s.apiKey)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return false, 0, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return false, 0, fmt.Errorf("failed to fetch serviceability, status: %d", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	var result struct {
		DeliveryCodes []struct {
			PostalCode struct {
				PrePaid string `json:"pre_paid"`
			} `json:"postal_code"`
		} `json:"delivery_codes"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return false, 0, err
	}

	if len(result.DeliveryCodes) > 0 && result.DeliveryCodes[0].PostalCode.PrePaid == "Y" {
		if weightGrams <= 0 {
			weightGrams = 500
		}
		freightURL := fmt.Sprintf("https://track.delhivery.com/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin=%s&o_pin=500033&cgm=%d", pincode, weightGrams)
		fReq, _ := http.NewRequest("GET", freightURL, nil)
		fReq.Header.Set("Authorization", "Token "+s.apiKey)
		fReq.Header.Set("Content-Type", "application/json")

		fResp, fErr := client.Do(fReq)
		if fErr == nil {
			defer fResp.Body.Close()
			fBody, _ := io.ReadAll(fResp.Body)

			var freightRes []struct {
				TotalAmount float64 `json:"total_amount"`
			}
			if err := json.Unmarshal(fBody, &freightRes); err == nil && len(freightRes) > 0 {
				return true, freightRes[0].TotalAmount, nil
			}
		}

		return true, 50.0, nil
	}

	return false, 0, nil
}

func (s *liveDelhiveryService) BatchPickup(orders []models.Order) (map[string]ShipmentBookingResult, error) {
	if len(orders) == 0 {
		return map[string]ShipmentBookingResult{}, nil
	}

	if s.mock {
		results := make(map[string]ShipmentBookingResult)
		for _, o := range orders {
			if o.ShippingZIPCode == "999999" || strings.HasPrefix(o.ID, "ORD_FAIL_") {
				results[o.ID] = ShipmentBookingResult{
					Rejected: true,
					Remarks:  "Pincode not serviceable by carrier",
				}
			} else {
				suffix := o.ID
				if len(suffix) > 8 {
					suffix = suffix[len(suffix)-8:]
				}
				results[o.ID] = ShipmentBookingResult{
					Success:        true,
					TrackingNumber: "DEL" + suffix + "IN",
				}
			}
		}
		return results, nil
	}
	if s.apiKey == "" {
		return nil, ErrCarrierNotConfigured
	}

	type Shipment struct {
		Name          string  `json:"name"`
		Add           string  `json:"add"`
		Pin           string  `json:"pin"`
		City          string  `json:"city"`
		State         string  `json:"state"`
		Country       string  `json:"country"`
		Phone         string  `json:"phone"`
		Order         string  `json:"order"`
		PaymentMode   string  `json:"payment_mode"`
		ReturnPin     string  `json:"return_pin"`
		ReturnCity    string  `json:"return_city"`
		ReturnState   string  `json:"return_state"`
		ReturnCountry string  `json:"return_country"`
		ProductsDesc  string  `json:"products_desc"`
		CodAmount     float64 `json:"cod_amount"`
		OrderDate     string  `json:"order_date"`
		ShippingMode  string  `json:"shipping_mode"`
	}

	type Payload struct {
		PickupLocation struct {
			Name    string `json:"name"`
			City    string `json:"city"`
			Pin     string `json:"pin"`
			Country string `json:"country"`
			Phone   string `json:"phone"`
			Add     string `json:"add"`
		} `json:"pickup_location"`
		Shipments []Shipment `json:"shipments"`
	}

	var payload Payload
	payload.PickupLocation.Name = "The Ethnic Touch Warehouse"
	payload.PickupLocation.City = "Hyderabad"
	payload.PickupLocation.Pin = "500033"
	payload.PickupLocation.Country = "India"
	payload.PickupLocation.Phone = "9999999999" // Replace with real phone
	payload.PickupLocation.Add = "Hyderabad, Telangana"

	for _, o := range orders {
		var productDesc []string
		for _, item := range o.Items {
			productDesc = append(productDesc, fmt.Sprintf("%dx %s", item.Quantity, item.ProductName))
		}

		orderDate := time.Now().Format("2006-01-02")
		if len(o.CreatedAt) >= 10 {
			orderDate = o.CreatedAt[:10]
		}

		payload.Shipments = append(payload.Shipments, Shipment{
			Name:          o.ShippingName,
			Add:           o.ShippingAddress,
			Pin:           o.ShippingZIPCode,
			City:          o.ShippingCity,
			State:         o.ShippingState,
			Country:       "India",
			Phone:         o.ShippingPhone,
			Order:         o.ID,
			PaymentMode:   "Prepaid",
			ReturnPin:     "500033",
			ReturnCity:    "Hyderabad",
			ReturnState:   "Telangana",
			ReturnCountry: "India",
			ProductsDesc:  strings.Join(productDesc, ", "),
			CodAmount:     0,
			OrderDate:     orderDate,
			ShippingMode:  "Surface",
		})
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	data := url.Values{}
	data.Set("format", "json")
	data.Set("data", string(payloadBytes))

	req, err := http.NewRequest("POST", "https://track.delhivery.com/api/cmu/create.json", strings.NewReader(data.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Token "+s.apiKey)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return nil, fmt.Errorf("read carrier batch response: %w", err)
	}
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("carrier booking returned HTTP %d", resp.StatusCode)
	}

	var dlvResp struct {
		Success  bool `json:"success"`
		Packages []struct {
			Status  string   `json:"status"`
			Waybill string   `json:"waybill"`
			Refnum  string   `json:"refnum"`
			Remarks []string `json:"remarks"`
		} `json:"packages"`
		Rmk string `json:"rmk"`
	}

	if err := json.Unmarshal(body, &dlvResp); err != nil {
		return nil, fmt.Errorf("decode carrier batch response: %w", err)
	}

	results := make(map[string]ShipmentBookingResult)
	for _, pkg := range dlvResp.Packages {
		isSuccess := strings.EqualFold(pkg.Status, "Success")
		results[pkg.Refnum] = ShipmentBookingResult{
			Success:        isSuccess,
			Rejected:       strings.EqualFold(pkg.Status, "Fail") && strings.TrimSpace(pkg.Waybill) == "",
			TrackingNumber: pkg.Waybill,
			Remarks:        strings.Join(pkg.Remarks, ", "),
		}
	}

	return results, nil
}

// ValidateWebhookSignature validates the HMAC signature from Delhivery
func (s *liveDelhiveryService) ValidateWebhookSignature(payload []byte, signature string) bool {
	if s.webhookSecret == "" {
		// If no secret configured, reject or accept based on strictness. We reject for safety.
		return false
	}

	mac := hmac.New(sha256.New, []byte(s.webhookSecret))
	mac.Write(payload)
	expectedMAC := hex.EncodeToString(mac.Sum(nil))

	return hmac.Equal([]byte(signature), []byte(expectedMAC))
}

func (s *liveDelhiveryService) ValidateWebhookToken(token string) bool {
	return s.webhookSecret != "" && hmac.Equal([]byte(token), []byte(s.webhookSecret))
}
