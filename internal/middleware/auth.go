package middleware

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"ethnictouch/internal/repository"
)

type contextKey string
const RoleKey contextKey = "role"
const EmailKey contextKey = "email"

func AdminAuthMiddleware(superAdminEmail string, adminRepo repository.AdminUserRepository, allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")

			token := ""
			if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
				token = authHeader[7:]
			}

			if token == "" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized: missing token"})
				return
			}

			// Verify Firebase token using Google Identity Toolkit
			apiKey := "AIzaSyDSrS3zywg8ao1lvK9NWmy1RDR33Nim2h8"
			reqBody := `{"idToken":"` + token + `"}`
			resp, err := http.Post("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+apiKey, "application/json", strings.NewReader(reqBody))
			
			if err != nil || resp.StatusCode != http.StatusOK {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized: invalid Firebase token"})
				return
			}
			defer resp.Body.Close()

			var tokenInfo struct {
				Users []struct {
					Email string `json:"email"`
				} `json:"users"`
			}
			if err := json.NewDecoder(resp.Body).Decode(&tokenInfo); err != nil || len(tokenInfo.Users) == 0 || tokenInfo.Users[0].Email == "" {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized: failed to parse Firebase token response"})
				return
			}

			userEmail := strings.ToLower(tokenInfo.Users[0].Email)
			safeSuperAdmin := strings.ToLower(superAdminEmail)
			var role string

			if userEmail == safeSuperAdmin {
				role = "admin"
			} else {
				dbRole, err := adminRepo.GetRoleByEmail(userEmail)
				if err != nil || dbRole == "" {
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusForbidden)
					json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: access denied"})
					return
				}
				role = dbRole
			}

			// Check if role is allowed for this endpoint
			roleAllowed := false
			for _, allowed := range allowedRoles {
				if role == allowed {
					roleAllowed = true
					break
				}
			}

			// Admin always has access even if only 'employee' is passed? 
			// Actually, if we pass "admin", only admin has access. If we pass "admin", "employee", both have access.
			// However, SuperAdmins / admins should always have access implicitly.
			if role == "admin" {
				roleAllowed = true
			}

			if !roleAllowed {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusForbidden)
				json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden: insufficient permissions"})
				return
			}

			ctx := context.WithValue(r.Context(), RoleKey, role)
			ctx = context.WithValue(ctx, EmailKey, userEmail)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
