package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAdminAuthMiddleware(t *testing.T) {
	expectedKey := "secret_admin_key_99"
	mw := AdminAuthMiddleware(expectedKey)

	dummyHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"success"}`))
	})

	protectedHandler := mw(dummyHandler)

	t.Run("Valid Admin Token", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/admin/coupons", nil)
		req.Header.Set("Authorization", "Bearer secret_admin_key_99")
		rr := httptest.NewRecorder()

		protectedHandler.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Expected status OK (200), got %d", rr.Code)
		}
	})

	t.Run("Invalid Admin Token", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/admin/coupons", nil)
		req.Header.Set("Authorization", "Bearer wrong_token")
		rr := httptest.NewRecorder()

		protectedHandler.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected status Unauthorized (401), got %d", rr.Code)
		}
	})

	t.Run("Missing Authorization Header", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/admin/coupons", nil)
		rr := httptest.NewRecorder()

		protectedHandler.ServeHTTP(rr, req)

		if rr.Code != http.StatusUnauthorized {
			t.Errorf("Expected status Unauthorized (401), got %d", rr.Code)
		}
	})
}
