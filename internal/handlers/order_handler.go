package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"time"

	"ethnictouch/internal/middleware"
	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
	"ethnictouch/internal/utils"
)

type OrderHandler struct {
	svc          service.OrderService
	profileSvc   service.ProfileService
	configSvc    service.ConfigService
	delhiverySvc service.DelhiveryService
}

func NewOrderHandler(svc service.OrderService, profileSvc service.ProfileService, configSvc service.ConfigService, delhiverySvc service.DelhiveryService) *OrderHandler {
	return &OrderHandler{svc: svc, profileSvc: profileSvc, configSvc: configSvc, delhiverySvc: delhiverySvc}
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

	req.UserID = r.Header.Get("X-User-Id")

	order, razorpayOrderID, checkoutURL, err := h.svc.CreateOrder(&req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": utils.FormatError(err)})
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

	resp, err := h.svc.VerifyPayment(&req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": utils.FormatError(err)})
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
	json.NewEncoder(w).Encode(resp)
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

		if email == "" {
			role, _ := r.Context().Value(middleware.RoleKey).(string)
			if role != "admin" && role != "employee" {
				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode([]models.Order{})
				return
			}
		}

		orders, err := h.svc.GetAllOrders(email)
		if err != nil {
			http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
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
		w.Write([]byte(fmt.Sprintf(`{"error":"Failed to confirm pickup: %s"}`, err.Error())))
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

func (h *OrderHandler) HandleShippingEstimate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pincode := r.URL.Query().Get("pincode")
	if pincode == "" {
		http.Error(w, "Pincode is required", http.StatusBadRequest)
		return
	}

	cartSizeStr := r.URL.Query().Get("cart_size")
	cartSize := 1
	if cartSizeStr != "" {
		parsed, err := strconv.Atoi(cartSizeStr)
		if err == nil && parsed > 0 {
			cartSize = parsed
		}
	}
	weightGrams := cartSize * 500

	serviceable, estCost, err := h.delhiverySvc.CheckServiceability(pincode, weightGrams)
	if err != nil {
		http.Error(w, utils.FormatError(err), http.StatusInternalServerError)
		return
	}

	if !serviceable {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"serviceable": false,
		})
		return
	}

	charge := estCost
	if charge < 59.0 {
		charge = 59.0
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"serviceable": true,
		"charge":      charge,
	})
}

func (h *OrderHandler) HandleShippingTimeline(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	now := time.Now()
	cutoff := time.Date(now.Year(), now.Month(), now.Day(), 13, 30, 0, 0, now.Location())

	var message string
	if now.Before(cutoff) {
		diff := cutoff.Sub(now)
		hrs := int(diff.Hours())
		mins := int(diff.Minutes()) % 60
		message = fmt.Sprintf("Order within %d hrs %d mins for shipping today", hrs, mins)
	} else {
		message = "Order placed after cutoff. Shipping tomorrow"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"cutoffTimestamp": cutoff.Unix(),
		"currentTime":     now.Unix(),
		"message":         message,
	})
}

func (h *OrderHandler) HandleDelhiveryWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	payload, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	signature := r.Header.Get("X-Delhivery-Signature")
	if !h.delhiverySvc.ValidateWebhookSignature(payload, signature) {
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	var data map[string]interface{}
	if err := json.Unmarshal(payload, &data); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	orderID, ok := data["order_id"].(string)
	if !ok {
		http.Error(w, "Missing order_id", http.StatusBadRequest)
		return
	}
	
	status, ok := data["status"].(string)
	if !ok {
		http.Error(w, "Missing status", http.StatusBadRequest)
		return
	}

	internalStatus := "pending"
	switch status {
	case "In Transit", "Dispatched", "Picked Up":
		internalStatus = "shipped"
	case "Delivered":
		internalStatus = "delivered"
	default:
		internalStatus = "pending"
	}

	err = h.svc.UpdateOrderStatus(orderID, internalStatus, "", "DLV_UPDATE", time.Now().Format(time.RFC3339), "")
	if err != nil {
		http.Error(w, "Failed to update order status", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
