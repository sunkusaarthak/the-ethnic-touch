package middleware

import (
	"crypto/subtle"
	"encoding/json"
	"net/http"
)

// AdminAuthMiddleware ensures that the correct admin API key is provided
func AdminAuthMiddleware(expectedKey string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")

			token := ""
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				token = authHeader[7:]
			}

			if subtle.ConstantTimeCompare([]byte(token), []byte(expectedKey)) != 1 {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized access to admin API"})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
