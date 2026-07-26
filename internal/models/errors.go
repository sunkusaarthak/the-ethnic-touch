package models

import "errors"

var (
	ErrNotFound          = errors.New("record not found")
	ErrInsufficientStock = errors.New("insufficient stock available")
	ErrInvalidInput      = errors.New("invalid input parameters")
)
