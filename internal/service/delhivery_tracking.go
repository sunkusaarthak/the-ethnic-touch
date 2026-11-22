package service

import (
	"context"
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

type DelhiveryShipment struct {
	Waybill   string        `json:"AWB"`
	Reference string        `json:"ReferenceNo"`
	Status    DelhiveryScan `json:"Status"`
	Scans     []struct {
		Detail DelhiveryScan `json:"ScanDetail"`
	} `json:"Scans"`
}

type DelhiveryScan struct {
	Status          string `json:"Status"`
	Scan            string `json:"Scan"`
	StatusType      string `json:"StatusType"`
	ScanType        string `json:"ScanType"`
	StatusDateTime  string `json:"StatusDateTime"`
	ScanDateTime    string `json:"ScanDateTime"`
	StatusLocation  string `json:"StatusLocation"`
	ScannedLocation string `json:"ScannedLocation"`
}

var ErrUnknownScan = errors.New("unrecognized tracking scan")

func (s DelhiveryScan) Event() (models.ShipmentEvent, error) {
	status := strings.ToLower(strings.TrimSpace(firstCarrierValue(s.Status, s.Scan)))
	direction := strings.ToUpper(strings.TrimSpace(firstCarrierValue(s.StatusType, s.ScanType)))
	var customerStatus string
	switch status {
	case "manifested", "ready to ship", "waybill created":
		customerStatus = "waybill_created"
	case "ready for pickup", "pickup scheduled":
		customerStatus = "pickup_scheduled"
	case "picked up", "dispatched", "in transit":
		customerStatus = "in_transit"
	case "out for delivery":
		customerStatus = "out_for_delivery"
	case "delivered":
		customerStatus = "delivered"
	case "returned", "rto delivered":
		customerStatus = "returned"
	default:
		return models.ShipmentEvent{}, ErrUnknownScan
	}
	if direction == "RT" || direction == "RTO" {
		if customerStatus == "delivered" || customerStatus == "returned" {
			customerStatus = "returned"
		} else {
			customerStatus = "return_in_progress"
		}
	}

	stamp := strings.TrimSpace(firstCarrierValue(s.StatusDateTime, s.ScanDateTime))
	when, err := time.Parse(time.RFC3339Nano, stamp)
	if err != nil {
		// Delhivery's sample scan timestamps omit the offset. Interpret them as Indian local time.
		when, err = time.ParseInLocation("2006-01-02T15:04:05", strings.Replace(stamp, " ", "T", 1), time.FixedZone("IST", 19800))
		if err != nil {
			return models.ShipmentEvent{}, fmt.Errorf("invalid tracking timestamp: %w", err)
		}
	}
	location := []rune(strings.TrimSpace(firstCarrierValue(s.StatusLocation, s.ScannedLocation)))
	if len(location) > 160 {
		location = location[:160]
	}
	return models.ShipmentEvent{Status: customerStatus, OccurredAt: when.UTC().Truncate(time.Microsecond), Location: string(location)}, nil
}

func firstCarrierValue(primary, fallback string) string {
	if primary != "" {
		return primary
	}
	return fallback
}

func (s *liveDelhiveryService) FetchTracking(ctx context.Context, waybills []string) (map[string][]models.ShipmentEvent, error) {
	if len(waybills) == 0 || s.mock {
		return nil, nil
	}
	if s.apiKey == "" {
		return nil, ErrCarrierNotConfigured
	}
	if len(waybills) > 50 {
		return nil, fmt.Errorf("too many waybills for a tracking request")
	}
	params := url.Values{"waybill": {strings.Join(waybills, ",")}}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://track.delhivery.com/api/v1/packages/json/?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Token "+s.apiKey)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("carrier tracking returned HTTP %d", resp.StatusCode)
	}
	return decodeDelhiveryTracking(io.LimitReader(resp.Body, 4<<20))
}

func decodeDelhiveryTracking(body io.Reader) (map[string][]models.ShipmentEvent, error) {
	var response struct {
		Shipments []struct {
			Shipment DelhiveryShipment `json:"Shipment"`
		} `json:"ShipmentData"`
	}
	if err := json.NewDecoder(body).Decode(&response); err != nil {
		return nil, fmt.Errorf("decode carrier tracking response: %w", err)
	}
	if response.Shipments == nil {
		return nil, fmt.Errorf("carrier tracking response did not contain shipment data")
	}
	events := make(map[string][]models.ShipmentEvent)
	for _, result := range response.Shipments {
		shipment := result.Shipment
		waybill := strings.TrimSpace(shipment.Waybill)
		if waybill == "" {
			continue
		}
		for _, entry := range shipment.Scans {
			if event, err := entry.Detail.Event(); err == nil {
				events[waybill] = append(events[waybill], event)
			}
		}
		if event, err := shipment.Status.Event(); err == nil {
			events[waybill] = append(events[waybill], event)
		}
	}
	return events, nil
}
