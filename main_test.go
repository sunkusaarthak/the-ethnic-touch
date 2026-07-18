package main

import (
	"bytes"
	"database/sql"
	"net/http"
	"net/http/httptest"
	"testing"

	_ "modernc.org/sqlite"
)

func setupTestDB(t *testing.T) *sql.DB {
	t.Helper()
	conn, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("open test db: %v", err)
	}
	if _, err := conn.Exec(`
		CREATE TABLE profiles (
			user_id TEXT PRIMARY KEY,
			full_name TEXT NOT NULL,
			phone TEXT NOT NULL,
			address TEXT NOT NULL,
			city TEXT NOT NULL,
			state TEXT NOT NULL,
			zip_code TEXT NOT NULL,
			preferred_size TEXT,
			style_notes TEXT,
			created_at TEXT NOT NULL,
			updated_at TEXT NOT NULL
		);
	`); err != nil {
		t.Fatalf("create profiles table: %v", err)
	}
	db = conn
	return conn
}

func TestProfileMeHandlerCreateAndUpdate(t *testing.T) {
	setupTestDB(t)
	defer db.Close()

	createReq := httptest.NewRequest(http.MethodPost, "/api/profile/me", bytes.NewBufferString(`{"fullName":"Ada Lovelace","phone":"9876543210","address":"12 Regent Street","city":"London","state":"ENG","zipCode":"SW1A"}`))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.Header.Set("X-User-Id", "user-1")
	createResp := httptest.NewRecorder()
	profileMeHandler(createResp, createReq)
	if createResp.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d body=%s", createResp.Code, createResp.Body.String())
	}

	getReq := httptest.NewRequest(http.MethodGet, "/api/profile/me", nil)
	getReq.Header.Set("X-User-Id", "user-1")
	getResp := httptest.NewRecorder()
	profileMeHandler(getResp, getReq)
	if getResp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", getResp.Code, getResp.Body.String())
	}

	updateReq := httptest.NewRequest(http.MethodPatch, "/api/profile/me", bytes.NewBufferString(`{"fullName":"Ada Byron","phone":"9876543210","address":"12 Regent Street","city":"London","state":"ENG","zipCode":"SW1A","preferredSize":"M","styleNotes":"Love minimal silhouettes"}`))
	updateReq.Header.Set("Content-Type", "application/json")
	updateReq.Header.Set("X-User-Id", "user-1")
	updateResp := httptest.NewRecorder()
	profileMeHandler(updateResp, updateReq)
	if updateResp.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d body=%s", updateResp.Code, updateResp.Body.String())
	}
}

func TestProfileMeHandlerRejectsInvalidPayload(t *testing.T) {
	setupTestDB(t)
	defer db.Close()

	invalidReq := httptest.NewRequest(http.MethodPost, "/api/profile/me", bytes.NewBufferString(`{"fullName":"","phone":"abc123","address":"","city":"","state":"","zipCode":""}`))
	invalidReq.Header.Set("Content-Type", "application/json")
	invalidReq.Header.Set("X-User-Id", "user-2")
	invalidResp := httptest.NewRecorder()
	profileMeHandler(invalidResp, invalidReq)
	if invalidResp.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d body=%s", invalidResp.Code, invalidResp.Body.String())
	}
}

func TestProfileMeHandlerUpsertsExistingProfile(t *testing.T) {
	setupTestDB(t)
	defer db.Close()

	createReq := httptest.NewRequest(http.MethodPost, "/api/profile/me", bytes.NewBufferString(`{"fullName":"Ada Lovelace","phone":"9876543210","address":"12 Regent Street","city":"London","state":"ENG","zipCode":"SW1A"}`))
	createReq.Header.Set("Content-Type", "application/json")
	createReq.Header.Set("X-User-Id", "user-3")
	createResp := httptest.NewRecorder()
	profileMeHandler(createResp, createReq)
	if createResp.Code != http.StatusCreated {
		t.Fatalf("expected 201 on first create, got %d body=%s", createResp.Code, createResp.Body.String())
	}

	duplicateReq := httptest.NewRequest(http.MethodPost, "/api/profile/me", bytes.NewBufferString(`{"fullName":"Ada Byron","phone":"9876543211","address":"12 Regent Street","city":"London","state":"ENG","zipCode":"SW1A","preferredSize":"M","styleNotes":"Love minimal silhouettes"}`))
	duplicateReq.Header.Set("Content-Type", "application/json")
	duplicateReq.Header.Set("X-User-Id", "user-3")
	duplicateResp := httptest.NewRecorder()
	profileMeHandler(duplicateResp, duplicateReq)
	if duplicateResp.Code != http.StatusOK {
		t.Fatalf("expected 200 on duplicate-safe upsert, got %d body=%s", duplicateResp.Code, duplicateResp.Body.String())
	}

	getReq := httptest.NewRequest(http.MethodGet, "/api/profile/me", nil)
	getReq.Header.Set("X-User-Id", "user-3")
	getResp := httptest.NewRecorder()
	profileMeHandler(getResp, getReq)
	if getResp.Code != http.StatusOK {
		t.Fatalf("expected 200 after upsert, got %d body=%s", getResp.Code, getResp.Body.String())
	}
}
