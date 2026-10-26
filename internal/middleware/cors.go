package middleware

import (
	"net/http"
	"os"
	"strings"
)

// CORSMiddleware handles origin whitelisting, preflight options, and header controls
func CORSMiddleware(next http.Handler) http.Handler {
	baseOrigins := []string{
		"http://localhost:5173",
		"http://localhost:3000",
		"http://localhost:8080",
		"https://the-ethnic-touch.onrender.com",
		"https://the-ethnic-touch-frontend.onrender.com",
		"https://the-ethnic-touch-frontend-2.onrender.com",
		"https://the-ethnic-touch-backend.onrender.com",
		"https://theethnictouch.com",
		"https://www.theethnictouch.com",
		"https://tet-backend-1.onrender.com",
	}

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		isAllowed := false

		if origin != "" {
			lowerOrigin := strings.ToLower(origin)

			// 1. Check static base origins
			for _, allowed := range baseOrigins {
				if strings.EqualFold(origin, allowed) {
					isAllowed = true
					break
				}
			}

			// 2. Check ALLOWED_ORIGINS environment variable
			if !isAllowed {
				if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
					for _, o := range strings.Split(envOrigins, ",") {
						if strings.EqualFold(origin, strings.TrimSpace(o)) {
							isAllowed = true
							break
						}
					}
				}
			}

			// 3. Dynamic match for render deploys and custom domain subdomains
			if !isAllowed {
				if lowerOrigin == "https://theethnictouch.com" || strings.HasSuffix(lowerOrigin, ".theethnictouch.com") {
					isAllowed = true
				} else if strings.HasSuffix(lowerOrigin, ".onrender.com") && (strings.Contains(lowerOrigin, "the-ethnic-touch") || strings.Contains(lowerOrigin, "tet-")) {
					isAllowed = true
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
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-User-Id, Accept, Origin, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
