package middleware

import (
	"encoding/json"
	"net/http"
	"strings"
	"sync"
	"time"
)

type ipVisitor struct {
	lastSeen time.Time
	tokens   int
}

type RateLimiter struct {
	mu         sync.Mutex
	visitors   map[string]*ipVisitor
	rate       int           // Max requests per window
	window     time.Duration // Time window duration
	cleanupInterval time.Duration
}

func NewRateLimiter(rate int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		visitors:        make(map[string]*ipVisitor),
		rate:            rate,
		window:          window,
		cleanupInterval: 10 * time.Minute,
	}

	go rl.cleanupLoop()
	return rl
}

func (rl *RateLimiter) cleanupLoop() {
	ticker := time.NewTicker(rl.cleanupInterval)
	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()
		for ip, v := range rl.visitors {
			if now.Sub(v.lastSeen) > rl.window*2 {
				delete(rl.visitors, ip)
			}
		}
		rl.mu.Unlock()
	}
}

func (rl *RateLimiter) getClientIP(r *http.Request) string {
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		parts := strings.Split(forwarded, ",")
		return strings.TrimSpace(parts[0])
	}
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" {
		return strings.TrimSpace(realIP)
	}
	ip := r.RemoteAddr
	if idx := strings.LastIndex(ip, ":"); idx != -1 {
		return ip[:idx]
	}
	return ip
}

func (rl *RateLimiter) Limit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := rl.getClientIP(r)

		rl.mu.Lock()
		now := time.Now()
		v, exists := rl.visitors[ip]
		if !exists || now.Sub(v.lastSeen) > rl.window {
			rl.visitors[ip] = &ipVisitor{
				lastSeen: now,
				tokens:   rl.rate - 1,
			}
			rl.mu.Unlock()
			next.ServeHTTP(w, r)
			return
		}

		if v.tokens <= 0 {
			rl.mu.Unlock()
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Retry-After", "60")
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(map[string]string{"error": "Too many requests. Please slow down."})
			return
		}

		v.tokens--
		v.lastSeen = now
		rl.mu.Unlock()

		next.ServeHTTP(w, r)
	})
}
