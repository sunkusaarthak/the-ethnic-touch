package middleware

import (
	"log/slog"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"
)

func TestPanicRecoveryMiddleware(t *testing.T) {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	mw := PanicRecoveryMiddleware(logger)

	panickyHandler := mw(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		panic("synthetic test panic")
	}))

	req := httptest.NewRequest("GET", "/test-panic", nil)
	rr := httptest.NewRecorder()

	panickyHandler.ServeHTTP(rr, req)

	if rr.Code != http.StatusInternalServerError {
		t.Errorf("Expected status InternalServerError (500), got %d", rr.Code)
	}

	body := rr.Body.String()
	if !testing.Short() && body == "" {
		t.Errorf("Expected non-empty JSON error response body")
	}
}

func TestSecurityHeadersMiddleware(t *testing.T) {
	dummy := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handler := SecurityHeadersMiddleware(dummy)
	req := httptest.NewRequest("GET", "/test", nil)
	rr := httptest.NewRecorder()

	handler.ServeHTTP(rr, req)

	headers := map[string]string{
		"X-Content-Type-Options": "nosniff",
		"X-Frame-Options":        "DENY",
		"X-XSS-Protection":      "1; mode=block",
		"Referrer-Policy":        "strict-origin-when-cross-origin",
	}

	for k, expectedVal := range headers {
		if val := rr.Header().Get(k); val != expectedVal {
			t.Errorf("Expected header %s to be %q, got %q", k, expectedVal, val)
		}
	}
}

func TestRateLimiterMiddleware(t *testing.T) {
	limiter := NewRateLimiter(2, time.Second)
	dummy := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handler := limiter.Limit(dummy)

	// 1st & 2nd request succeed
	for i := 0; i < 2; i++ {
		req := httptest.NewRequest("POST", "/api/orders", nil)
		req.RemoteAddr = "192.168.1.1:12345"
		rr := httptest.NewRecorder()
		handler.ServeHTTP(rr, req)
		if rr.Code != http.StatusOK {
			t.Errorf("Request %d expected 200 OK, got %d", i+1, rr.Code)
		}
	}

	// 3rd request exceeds limit -> 429
	req := httptest.NewRequest("POST", "/api/orders", nil)
	req.RemoteAddr = "192.168.1.1:12345"
	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusTooManyRequests {
		t.Errorf("Expected 429 Too Many Requests, got %d", rr.Code)
	}
}

func TestCORSMiddleware(t *testing.T) {
	dummy := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	handler := CORSMiddleware(dummy)

	t.Run("Preflight OPTIONS request", func(t *testing.T) {
		req := httptest.NewRequest("OPTIONS", "/api/products", nil)
		req.Header.Set("Origin", "http://localhost:5173")
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Expected 200 OK for OPTIONS preflight, got %d", rr.Code)
		}
		if rr.Header().Get("Access-Control-Allow-Origin") != "http://localhost:5173" {
			t.Errorf("Expected Access-Control-Allow-Origin header to match origin")
		}
	})

	t.Run("Allowed Render Frontend Origin", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/config/homepage", nil)
		req.Header.Set("Origin", "https://the-ethnic-touch-frontend-2.onrender.com")
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Header().Get("Access-Control-Allow-Origin") != "https://the-ethnic-touch-frontend-2.onrender.com" {
			t.Errorf("Expected CORS allow origin for the-ethnic-touch-frontend-2.onrender.com, got %q", rr.Header().Get("Access-Control-Allow-Origin"))
		}
	})

	t.Run("Dynamic Render Domain Origin", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/config/homepage", nil)
		req.Header.Set("Origin", "https://the-ethnic-touch-preview-pr12.onrender.com")
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Header().Get("Access-Control-Allow-Origin") != "https://the-ethnic-touch-preview-pr12.onrender.com" {
			t.Errorf("Expected CORS allow origin for dynamic Render preview, got %q", rr.Header().Get("Access-Control-Allow-Origin"))
		}
	})

	t.Run("Blocked Unauthorized Origin", func(t *testing.T) {
		req := httptest.NewRequest("GET", "/api/config/homepage", nil)
		req.Header.Set("Origin", "https://malicious-site.com")
		rr := httptest.NewRecorder()

		handler.ServeHTTP(rr, req)

		if rr.Header().Get("Access-Control-Allow-Origin") != "" {
			t.Errorf("Expected no Access-Control-Allow-Origin for unauthorized origin, got %q", rr.Header().Get("Access-Control-Allow-Origin"))
		}
	})
}
