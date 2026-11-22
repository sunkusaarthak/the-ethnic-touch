package utils

import (
	"strings"
)

// FormatError formats an internal system error into a user-friendly message
func FormatError(err error) string {
	if err == nil {
		return ""
	}
	msg := err.Error()
	msgLower := strings.ToLower(msg)

	// Authentication/Firebase related errors
	if strings.Contains(msgLower, "firebase") {
		return "Authentication issue occurred. Please try logging in again."
	}

	// Database related errors
	if strings.Contains(msgLower, "db") || strings.Contains(msgLower, "database") || strings.Contains(msgLower, "sql") || strings.Contains(msgLower, "mongo") || strings.Contains(msgLower, "duplicate key") {
		return "We are experiencing a temporary issue. Please try again later."
	}

	// Network/Connection related errors
	if strings.Contains(msgLower, "connection refused") || strings.Contains(msgLower, "dial tcp") || strings.Contains(msgLower, "timeout") {
		return "Service is temporarily unavailable. Please try again later."
	}

	// Default: if it's likely a business error (e.g., "product not found"), return it as is, 
	// otherwise return a generic message if it looks too technical.
	if strings.Contains(msgLower, "pointer") || strings.Contains(msgLower, "nil") || strings.Contains(msgLower, "panic") {
		return "An unexpected error occurred. Our team has been notified."
	}

	return msg
}

// FormatAuthError formats raw auth strings (used in middlewares) to user-friendly messages
func FormatAuthError(msg string) string {
	msgLower := strings.ToLower(msg)
	if strings.Contains(msgLower, "firebase") {
		return "Your session has expired or is invalid. Please log in again."
	}
	if strings.Contains(msgLower, "unauthorized") {
		return "Please log in to access this feature."
	}
	if strings.Contains(msgLower, "forbidden") {
		return "You do not have permission to perform this action."
	}
	return msg
}

// MaskEmail masks email like "j***h@gmail.com"
func MaskEmail(email string) string {
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return "***"
	}
	name, domain := parts[0], parts[1]
	if len(name) <= 2 {
		return name[:1] + "***@" + domain
	}
	return string(name[0]) + "***" + string(name[len(name)-1]) + "@" + domain
}

// MaskPhone masks phone number like "******5289"
func MaskPhone(phone string) string {
	if len(phone) < 4 {
		return "****"
	}
	return strings.Repeat("*", len(phone)-4) + phone[len(phone)-4:]
}

// MaskName masks name like "G**** J********"
func MaskName(name string) string {
	words := strings.Fields(name)
	if len(words) == 0 {
		return "***"
	}
	var masked []string
	for _, w := range words {
		if len(w) <= 1 {
			masked = append(masked, w)
		} else {
			masked = append(masked, string(w[0])+strings.Repeat("*", len(w)-1))
		}
	}
	return strings.Join(masked, " ")
}

// MaskAddress masks address line like "ESCI road, Kajaguda lake..."
func MaskAddress(addr string) string {
	if len(addr) <= 15 {
		return "***"
	}
	return addr[:12] + "..."
}
