package middleware

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

const customerIdentityKey contextKey = "customerIdentity"

type CustomerIdentity struct {
	UID           string
	Email         string
	EmailVerified bool
}

func CustomerFromContext(ctx context.Context) CustomerIdentity {
	identity, _ := ctx.Value(customerIdentityKey).(CustomerIdentity)
	return identity
}

func CustomerAuthMiddleware(next http.Handler) http.Handler {
	client := &http.Client{Timeout: 8 * time.Second}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Fields(r.Header.Get("Authorization"))
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			http.Error(w, "Authentication required", http.StatusUnauthorized)
			return
		}

		apiKey := os.Getenv("FIREBASE_WEB_API_KEY")
		if apiKey == "" {
			apiKey = "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8"
		}
		payload, _ := json.Marshal(map[string]string{"idToken": parts[1]})
		req, err := http.NewRequestWithContext(r.Context(), http.MethodPost,
			"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+url.QueryEscape(apiKey), bytes.NewReader(payload))
		if err != nil {
			http.Error(w, "Authentication unavailable", http.StatusServiceUnavailable)
			return
		}
		req.Header.Set("Content-Type", "application/json")
		resp, err := client.Do(req)
		if err != nil {
			http.Error(w, "Authentication unavailable", http.StatusServiceUnavailable)
			return
		}
		defer resp.Body.Close()
		var result struct {
			Users []struct {
				ID            string `json:"localId"`
				Email         string `json:"email"`
				EmailVerified bool   `json:"emailVerified"`
				Disabled      bool   `json:"disabled"`
			} `json:"users"`
		}
		if resp.StatusCode != http.StatusOK || json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&result) != nil ||
			len(result.Users) != 1 || result.Users[0].ID == "" || result.Users[0].Disabled {
			http.Error(w, "Invalid authentication token", http.StatusUnauthorized)
			return
		}
		user := result.Users[0]
		identity := CustomerIdentity{UID: user.ID, Email: strings.TrimSpace(user.Email), EmailVerified: user.EmailVerified}
		w.Header().Set("Cache-Control", "no-store")
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), customerIdentityKey, identity)))
	})
}
