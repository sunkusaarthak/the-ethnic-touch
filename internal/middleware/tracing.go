package middleware

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
)

// TracingMiddleware injects or propagates a unique X-Request-ID header
func TracingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := r.Header.Get("X-Request-ID")
		if requestID == "" {
			bytes := make([]byte, 8)
			_, _ = rand.Read(bytes)
			requestID = hex.EncodeToString(bytes)
		}

		w.Header().Set("X-Request-ID", requestID)
		next.ServeHTTP(w, r)
	})
}
