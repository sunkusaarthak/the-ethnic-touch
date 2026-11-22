package service

import (
	"strings"
	"testing"
	"time"
)

func TestDecodeDelhiveryTrackingKeepsCustomerFacingScans(t *testing.T) {
	body := strings.NewReader(`{
		"ShipmentData": [{"Shipment": {
			"AWB":"12345678901",
			"Status":{"Status":"Delivered","StatusType":"RT","StatusDateTime":"2026-11-22T14:30:00+05:30"},
			"Scans":[
				{"ScanDetail":{"Scan":"In Transit","ScanType":"UD","ScanDateTime":"2026-11-22T11:30:00.125","ScannedLocation":"Hyderabad"}},
				{"ScanDetail":{"Scan":"Internal scan","ScanDateTime":"2026-11-22T12:30:00"}}
			]
		}}]
	}`)
	events, err := decodeDelhiveryTracking(body)
	if err != nil {
		t.Fatal(err)
	}
	scans := events["12345678901"]
	if len(scans) != 2 || scans[0].Status != "in_transit" || scans[0].Location != "Hyderabad" || scans[1].Status != "returned" {
		t.Fatalf("unexpected scan history: %+v", scans)
	}
	if got := scans[0].OccurredAt.Format(time.RFC3339Nano); got != "2026-11-22T06:00:00.125Z" {
		t.Fatalf("offset-free scan time should be treated as IST, got %s", got)
	}
}
