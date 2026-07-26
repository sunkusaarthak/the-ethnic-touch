package models

import "testing"

func TestDomainErrors(t *testing.T) {
	if ErrNotFound == nil {
		t.Errorf("ErrNotFound should not be nil")
	}

	if ErrInsufficientStock == nil {
		t.Errorf("ErrInsufficientStock should not be nil")
	}

	if ErrInvalidInput == nil {
		t.Errorf("ErrInvalidInput should not be nil")
	}
}
