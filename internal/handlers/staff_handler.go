package handlers

import (
	"encoding/json"
	"net/http"
	"strings"

	"ethnictouch/internal/repository"
)

type StaffHandler struct {
	repo repository.AdminUserRepository
}

func NewStaffHandler(repo repository.AdminUserRepository) *StaffHandler {
	return &StaffHandler{repo: repo}
}

func (h *StaffHandler) HandleGetStaff(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	users, err := h.repo.GetAllUsers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func (h *StaffHandler) HandleAddStaff(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email string `json:"email"`
		Role  string `json:"role"` // "admin" or "employee"
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	if req.Role != "admin" && req.Role != "employee" {
		http.Error(w, "Invalid role", http.StatusBadRequest)
		return
	}

	email := strings.ToLower(req.Email)
	if err := h.repo.AddUser(email, req.Role); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *StaffHandler) HandleDeleteStaff(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	email := r.URL.Query().Get("email")
	if email == "" {
		http.Error(w, "Missing email", http.StatusBadRequest)
		return
	}

	if err := h.repo.DeleteUser(email); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
