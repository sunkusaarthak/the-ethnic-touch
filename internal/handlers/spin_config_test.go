package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type spinSettingsStub struct {
	service.ConfigService
}

func (spinSettingsStub) GetSpinWheelConfig() (*models.SpinWheelConfig, error) {
	return &models.SpinWheelConfig{
		Enabled: true, NewUserKurthiThreshold: 50,
		FirstTimeProbs: models.SpinWheelProbs{Prob5Off: 60, Prob10Off: 40},
	}, nil
}

func TestSpinConfig_PublicAndAdminResponses(t *testing.T) {
	handler := NewConfigHandler(spinSettingsStub{}, nil)
	public := httptest.NewRecorder()
	handler.HandleGetSpinConfig(public, httptest.NewRequest(http.MethodGet, "/api/config/spin-wheel", nil))
	var fields map[string]any
	if err := json.Unmarshal(public.Body.Bytes(), &fields); err != nil || public.Code != http.StatusOK ||
		len(fields) != 1 || fields["enabled"] != true {
		t.Fatalf("public spin config must expose only enabled, got %d %s", public.Code, public.Body)
	}

	admin := httptest.NewRecorder()
	handler.HandleGetAdminSpinConfig(admin, httptest.NewRequest(http.MethodGet, "/api/admin/config/spin-wheel", nil))
	var settings models.SpinWheelConfig
	if err := json.Unmarshal(admin.Body.Bytes(), &settings); err != nil || admin.Code != http.StatusOK ||
		settings.FirstTimeProbs.Prob5Off != 60 || settings.FirstTimeProbs.ProbBetterLuck != 0 ||
		settings.NewUserKurthiThreshold != 50 {
		t.Fatalf("admin config must preserve saved settings, got %d %s", admin.Code, admin.Body)
	}
}
