package models

import "errors"

var (
	ErrNotFound                = errors.New("record not found")
	ErrInsufficientStock       = errors.New("insufficient stock available")
	ErrInvalidInput            = errors.New("invalid input parameters")
	ErrEmailAlreadyRegistered  = errors.New("This email address is already registered with another mobile number. Please use a different email address.")
	ErrMobileAlreadyRegistered = errors.New("This mobile number is already registered with another email address. Please use a different mobile number.")
	ErrIdentityConflict        = errors.New("The email address and mobile number are associated with different accounts. Please use the correct details.")
)
