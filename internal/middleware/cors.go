package middleware

import (
	"net/http"
	"os"
	"strings"
)

// CORSMiddleware handles origin whitelisting, preflight options, and header controls
func CORSMiddleware(next http.Handler) http.Handler {
	allowedOrigins := []string{
		"http://localhost:5173",
		"http://localhost:3000",
		"http://localhost:8080",
		"https://the-ethnic-touch.onrender.com",
		"https://the-ethnic-touch-backend.onrender.com",
	}

	if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
		for _, o := range strings.Split(envOrigins, ",") {
			trimmed := strings.TrimSpace(o)
			if trimmed != "" {
				allowedOrigins = append(allowedOrigins, trimmed)
			}
		}
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		isAllowed := false

		if origin != "" {
			for _, allowed := range allowedOrigins {
				if strings.EqualFold(origin, allowed) {
					isAllowed = true
					break
				}
			}
		}

		if isAllowed {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
		} else if origin == "" {
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Id")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
