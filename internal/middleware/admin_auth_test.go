package middleware

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"ethnictouch/internal/models"
)

type mockAdminRepo struct {
	roles map[string]string
}

func (m *mockAdminRepo) GetRoleByEmail(email string) (string, error) {
	return m.roles[email], nil
}
func (m *mockAdminRepo) GetAllUsers() ([]models.AdminUser, error) { return nil, nil }
func (m *mockAdminRepo) AddUser(email, role string) error        { return nil }
func (m *mockAdminRepo) DeleteUser(email string) error           { return nil }

type mockAuthTransport struct {
	roundTripFunc func(req *http.Request) (*http.Response, error)
}

func (m *mockAuthTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	return m.roundTripFunc(req)
}

func TestAdminAuthMiddleware_EmailVerificationRequirement(t *testing.T) {
	superAdmin := "admin@ethnictouch.com"
	repo := &mockAdminRepo{
		roles: map[string]string{
			"staff@ethnictouch.com": "employee",
		},
	}

	origClient := authHTTPClient
	defer func() { authHTTPClient = origClient }()

	nextHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("privileged_ok"))
	})

	// 1. Privileged SuperAdmin email with unverified email must be rejected (403 Forbidden)
	authHTTPClient = &http.Client{
		Transport: &mockAuthTransport{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				respBody, _ := json.Marshal(map[string]interface{}{
					"users": []map[string]interface{}{
						{
							"email":         superAdmin,
							"emailVerified": false,
						},
					},
				})
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(bytes.NewReader(respBody)),
					Header:     http.Header{"Content-Type": []string{"application/json"}},
				}, nil
			},
		},
	}

	mw := AdminAuthMiddleware(superAdmin, repo, "admin")(nextHandler)
	req := httptest.NewRequest("GET", "/api/admin/dashboard", nil)
	req.Header.Set("Authorization", "Bearer unverified_token")
	rec := httptest.NewRecorder()
	mw.ServeHTTP(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden for unverified superadmin email, got %d: %s", rec.Code, rec.Body.String())
	}

	// 2. Verified SuperAdmin email succeeds (200 OK)
	authHTTPClient = &http.Client{
		Transport: &mockAuthTransport{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				respBody, _ := json.Marshal(map[string]interface{}{
					"users": []map[string]interface{}{
						{
							"email":         superAdmin,
							"emailVerified": true,
						},
					},
				})
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(bytes.NewReader(respBody)),
					Header:     http.Header{"Content-Type": []string{"application/json"}},
				}, nil
			},
		},
	}

	rec = httptest.NewRecorder()
	mw.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 OK for verified superadmin email, got %d: %s", rec.Code, rec.Body.String())
	}

	// 3. Unverified Staff/Employee email must be rejected (403 Forbidden)
	authHTTPClient = &http.Client{
		Transport: &mockAuthTransport{
			roundTripFunc: func(req *http.Request) (*http.Response, error) {
				respBody, _ := json.Marshal(map[string]interface{}{
					"users": []map[string]interface{}{
						{
							"email":         "staff@ethnictouch.com",
							"emailVerified": false,
						},
					},
				})
				return &http.Response{
					StatusCode: http.StatusOK,
					Body:       io.NopCloser(bytes.NewReader(respBody)),
					Header:     http.Header{"Content-Type": []string{"application/json"}},
				}, nil
			},
		},
	}

	staffMW := AdminAuthMiddleware(superAdmin, repo, "admin", "employee")(nextHandler)
	rec = httptest.NewRecorder()
	staffMW.ServeHTTP(rec, req)

	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 Forbidden for unverified staff email, got %d: %s", rec.Code, rec.Body.String())
	}
}
