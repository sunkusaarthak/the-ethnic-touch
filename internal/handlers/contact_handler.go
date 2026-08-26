package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type ContactHandler struct {
	svc service.ContactService
}

func NewContactHandler(svc service.ContactService) *ContactHandler {
	return &ContactHandler{svc: svc}
}

func (h *ContactHandler) HandlePostContact(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	var msg models.ContactMessage
	if err := json.NewDecoder(r.Body).Decode(&msg); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	if msg.Name == "" || msg.Email == "" || msg.Message == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	if err := h.svc.CreateMessage(&msg); err != nil {
		http.Error(w, "Failed to submit message", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Message received"})
}

func (h *ContactHandler) HandleAdminGetMessages(w http.ResponseWriter, r *http.Request) {
	messages, err := h.svc.GetMessages()
	if err != nil {
		http.Error(w, "Failed to get messages", http.StatusInternalServerError)
		return
	}
	
	count, _ := h.svc.GetUnreadCount()

	response := map[string]interface{}{
		"messages": messages,
		"unreadCount": count,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *ContactHandler) HandleAdminMarkRead(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	if idStr == "" {
		http.Error(w, "Missing ID", http.StatusBadRequest)
		return
	}
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.svc.MarkMessageRead(id); err != nil {
		http.Error(w, "Failed to update status", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Marked as read"})
}
