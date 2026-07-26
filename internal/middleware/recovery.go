package middleware

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"runtime/debug"
)

// PanicRecoveryMiddleware catches any unhandled panic during HTTP request handling, logs the stack trace, and returns HTTP 500 cleanly
func PanicRecoveryMiddleware(logger *slog.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					stack := string(debug.Stack())
					if logger != nil {
						logger.Error("HTTP Panic Intercepted",
							slog.Any("error", err),
							slog.String("method", r.Method),
							slog.String("path", r.URL.Path),
							slog.String("stack", stack),
						)
					} else {
						fmt.Printf("[PANIC RECOVERY] %v\n%s\n", err, stack)
					}

					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusInternalServerError)
					json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
				}
			}()

			next.ServeHTTP(w, r)
		})
	}
}
