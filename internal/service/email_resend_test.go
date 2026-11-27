package service

import (
	"encoding/json"
	"io"
	"net/http"
	"net/mail"
	"strings"
	"testing"

	"ethnictouch/internal/config"
	"ethnictouch/internal/models"
)

type resendTestTransport func(*http.Request) (*http.Response, error)

func (f resendTestTransport) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }

func TestEmailService_ResendOrderConfirmation(t *testing.T) {
	for _, tc := range []struct {
		name   string
		status int
		body   string
		err    string
	}{
		{name: "accepted", status: http.StatusOK, body: `{"id":"mock_message_id"}`},
		{name: "provider rejection", status: http.StatusForbidden, body: `{"message":"rejected customer@example.com"}`, err: "HTTP 403"},
		{name: "missing message ID", status: http.StatusOK, body: `{}`, err: "missing message ID"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			mailService := NewEmailService(&config.Config{
				ResendAPIKey:     " test-key ",
				EmailFromAddress: "orders@mail.example.com",
				EmailReplyTo:     "help@example.com",
			}).(*emailService)
			if !mailService.IsConfigured() {
				t.Fatal("Resend credentials alone should enable order email")
			}

			calls := 0
			mailService.resendClient.Transport = resendTestTransport(func(req *http.Request) (*http.Response, error) {
				calls++
				if req.Method != http.MethodPost || req.URL.String() != "https://api.resend.com/emails" {
					t.Fatalf("unexpected request: %s %s", req.Method, req.URL)
				}
				if req.Header.Get("Authorization") != "Bearer test-key" || req.Header.Get("Content-Type") != "application/json" {
					t.Fatal("missing Resend authorization or JSON content type")
				}
				defer req.Body.Close()
				var payload resendEmail
				if err := json.NewDecoder(req.Body).Decode(&payload); err != nil {
					t.Fatal(err)
				}
				from, err := mail.ParseAddress(payload.From)
				if err != nil || from.Address != "orders@mail.example.com" || from.Name != "The Ethnic Touch" {
					t.Fatalf("unexpected sender: %q (%v)", payload.From, err)
				}
				if len(payload.To) != 1 || payload.To[0] != "customer@example.com" || payload.ReplyTo != "help@example.com" {
					t.Fatalf("unexpected recipients: to=%v reply-to=%q", payload.To, payload.ReplyTo)
				}
				if !strings.Contains(payload.Subject, "ORD_TEST") || !strings.Contains(payload.HTML, "ORD_TEST") || !strings.Contains(payload.Text, "ORD_TEST") {
					t.Fatal("order reference should be in the subject, HTML, and plain text")
				}
				return &http.Response{StatusCode: tc.status, Body: io.NopCloser(strings.NewReader(tc.body))}, nil
			})

			err := mailService.SendOrderConfirmation(&models.Order{
				ID: "ORD_TEST", Status: "paid", CheckoutType: "delivery", CustomerEmail: "customer@example.com",
			})
			if tc.err == "" && err != nil {
				t.Fatalf("expected successful API acceptance, got %v", err)
			}
			if tc.err != "" && (err == nil || !strings.Contains(err.Error(), tc.err) || strings.Contains(err.Error(), "customer@example.com")) {
				t.Fatalf("expected sanitized error containing %q, got %v", tc.err, err)
			}
			if calls != 1 {
				t.Fatalf("got %d API requests, want one", calls)
			}
		})
	}
}
