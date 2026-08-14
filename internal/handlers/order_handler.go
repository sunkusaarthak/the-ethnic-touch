package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type OrderHandler struct {
	svc        service.OrderService
	profileSvc service.ProfileService
	configSvc  service.ConfigService
}

func NewOrderHandler(svc service.OrderService, profileSvc service.ProfileService, configSvc service.ConfigService) *OrderHandler {
	return &OrderHandler{svc: svc, profileSvc: profileSvc, configSvc: configSvc}
}

func (h *OrderHandler) HandleCheckout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	var req models.OrderCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid checkout JSON payload"}`))
		return
	}

	order, razorpayOrderID, checkoutURL, err := h.svc.CreateOrder(&req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	resp := map[string]interface{}{
		"orderId":         order.ID,
		"checkoutUrl":     checkoutURL,
		"razorpayOrderId": razorpayOrderID,
		"amount":          order.TotalAmount,
		"razorpayKey":     os.Getenv("RAZORPAY_KEY_ID"),
		"status":          order.Status,
		"paymentMethod":   order.PaymentMethod,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *OrderHandler) HandleVerifyPayment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.OrderVerifyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid request payload"}`))
		return
	}

	if err := h.svc.VerifyPayment(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	if order, err := h.svc.GetOrder(req.OrderID); err == nil {
		profiles, _ := h.profileSvc.GetAllProfiles()
		var userID string
		for _, p := range profiles {
			if p.Email == order.CustomerEmail {
				userID = p.UserID
				break
			}
		}
		if userID != "" {
			h.profileSvc.AddSpinTicket(userID, 1)
		}
		h.configSvc.IncrementOrderKurthiCounter()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Payment verified and order finalized successfully"})
}

func (h *OrderHandler) HandleGetOrder(w http.ResponseWriter, r *http.Request) {
	orderID := r.URL.Query().Get("orderId")
	if orderID == "" {
		orderID = r.PathValue("id")
	}

	if orderID == "" {
		email := r.URL.Query().Get("email")
		userID := r.Header.Get("X-User-Id")
		if userID == "" {
			userID = r.URL.Query().Get("userId")
		}

		if email == "" && userID != "" && h.profileSvc != nil {
			p, err := h.profileSvc.GetProfile(userID)
			if err == nil && p != nil {
				email = p.Email
			}
		}

		orders, err := h.svc.GetAllOrders(email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(orders)
		return
	}

	order, err := h.svc.GetOrder(orderID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error":"Order not found"}`))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

func (h *OrderHandler) HandleConfirmPickup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		OrderID string `json:"orderId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid payload"}`))
		return
	}

	order, err := h.svc.GetOrder(req.OrderID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error":"Order not found"}`))
		return
	}

	if err := h.svc.ConfirmPickup(req.OrderID); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to confirm pickup"}`))
		return
	}

	if order.PaymentMethod == "offline_qr" {
		profiles, _ := h.profileSvc.GetAllProfiles()
		var userID string
		for _, p := range profiles {
			if p.Email == order.CustomerEmail {
				userID = p.UserID
				break
			}
		}
		if userID != "" {
			h.profileSvc.AddSpinTicket(userID, 1)
		}
		h.configSvc.IncrementOrderKurthiCounter()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Pickup confirmed successfully"})
}
