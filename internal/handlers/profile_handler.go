package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type ProfileHandler struct {
	svc service.ProfileService
}

func NewProfileHandler(svc service.ProfileService) *ProfileHandler {
	return &ProfileHandler{svc: svc}
}

func (h *ProfileHandler) HandleProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		userID = r.URL.Query().Get("userId")
	}

	if userID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error":"Missing user identification header"}`))
		return
	}

	if r.Method == http.MethodGet {
		profile, err := h.svc.GetProfile(userID)
		if err != nil {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte(`{"error":"Profile not found"}`))
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(profile)
	} else if r.Method == http.MethodPost || r.Method == http.MethodPut || r.Method == http.MethodPatch {
		r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
		var p models.Profile
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, "Invalid profile payload", http.StatusBadRequest)
			return
		}
		p.UserID = userID

		if err := h.svc.UpsertProfile(&p); err != nil {
			if err == models.ErrEmailAlreadyRegistered || 
			   err == models.ErrMobileAlreadyRegistered || 
			   err == models.ErrIdentityConflict {
				http.Error(w, err.Error(), http.StatusConflict)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(p)
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *ProfileHandler) HandleAddresses(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-Id")
	if userID == "" {
		userID = r.URL.Query().Get("userId")
	}

	if userID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error":"Missing user identification header"}`))
		return
	}

	if r.Method == http.MethodGet {
		addresses, err := h.svc.GetAddresses(userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(addresses)
	} else if r.Method == http.MethodPost {
		var addr models.Address
		if err := json.NewDecoder(r.Body).Decode(&addr); err != nil {
			http.Error(w, "Invalid address payload", http.StatusBadRequest)
			return
		}
		addr.UserID = userID

		if err := h.svc.CreateAddress(&addr); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(addr)
	} else if r.Method == http.MethodPatch {
		idStr := r.URL.Query().Get("id")
		id, err := strconv.Atoi(idStr)
		if err != nil || id <= 0 {
			http.Error(w, "Invalid address ID", http.StatusBadRequest)
			return
		}
		if err := h.svc.SetDefaultAddress(userID, id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Default address updated"})
	} else if r.Method == http.MethodDelete {
		idStr := r.URL.Query().Get("id")
		id, err := strconv.Atoi(idStr)
		if err != nil || id <= 0 {
			http.Error(w, "Invalid address ID", http.StatusBadRequest)
			return
		}
		if err := h.svc.DeleteAddress(userID, id); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Address deleted"})
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}
