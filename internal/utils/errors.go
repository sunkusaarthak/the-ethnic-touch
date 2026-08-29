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
