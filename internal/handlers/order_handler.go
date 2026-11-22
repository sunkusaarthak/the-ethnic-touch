package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"ethnictouch/internal/middleware"
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
	"ethnictouch/internal/service"
	"ethnictouch/internal/utils"
)

type OrderHandler struct {
	svc          service.OrderService
	profileSvc   service.ProfileService
	configSvc    service.ConfigService
	delhiverySvc service.DelhiveryService
	emailSvc     service.EmailService
}

func NewOrderHandler(svc service.OrderService, profileSvc service.ProfileService, configSvc service.ConfigService, delhiverySvc service.DelhiveryService, emailSvc service.EmailService) *OrderHandler {
	return &OrderHandler{
		svc:          svc,
		profileSvc:   profileSvc,
		configSvc:    configSvc,
		delhiverySvc: delhiverySvc,
		emailSvc:     emailSvc,
	}
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

	identity := middleware.CustomerFromContext(r.Context())
	if !identity.EmailVerified || identity.Email == "" {
		writeOrderError(w, http.StatusForbidden, "Verify your email before placing an order")
		return
	}
	req.UserID = identity.UID
	req.CustomerEmail = identity.Email

	order, razorpayOrderID, checkoutURL, err := h.svc.CreateOrder(&req)
	if err != nil {
		var changed *service.PriceChangedError
		if errors.As(err, &changed) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict)
			json.NewEncoder(w).Encode(map[string]any{"error": changed.Error(), "totalPaise": changed.TotalPaise})
			return
		}
		if errors.Is(err, service.ErrCarrierNotConfigured) {
			writeOrderError(w, http.StatusServiceUnavailable, "Delivery quotes are temporarily unavailable")
			return
		}
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

	if order.PaymentMethod == "offline_qr" && h.emailSvc != nil {
		orderCopy := *order
		go func(o models.Order) {
			if err := h.emailSvc.SendOrderConfirmation(&o); err != nil {
				log.Printf("[Email] Error sending offline QR order confirmation for %s: %v", o.ID, err)
			}
		}(orderCopy)
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
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 32<<10)).Decode(&req); err != nil || req.OrderID == "" {
		writeOrderError(w, http.StatusBadRequest, "Invalid payment verification request")
		return
	}
	if _, ok := h.getAuthorizedOrder(w, r, req.OrderID, false); !ok {
		return
	}
	resp, err := h.svc.VerifyPayment(&req)
	if err != nil {
		if errors.Is(err, service.ErrPaymentNeedsConfirmation) {
			writeOrderError(w, http.StatusConflict, "Payment still needs confirmation. Check your order status before retrying payment.")
			return
		}
		writeOrderError(w, http.StatusBadRequest, "Payment could not be verified")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *OrderHandler) HandleRazorpayWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	secret := os.Getenv("RAZORPAY_WEBHOOK_SECRET")
	if secret == "" {
		http.Error(w, "Webhook is unavailable", http.StatusServiceUnavailable)
		return
	}
	body, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 256<<10))
	if err != nil {
		http.Error(w, "Invalid webhook body", http.StatusBadRequest)
		return
	}
	provided, err := hex.DecodeString(r.Header.Get("X-Razorpay-Signature"))
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	if err != nil || !hmac.Equal(provided, mac.Sum(nil)) {
		http.Error(w, "Invalid webhook signature", http.StatusUnauthorized)
		return
	}

	var event struct {
		Event   string `json:"event"`
		Payload struct {
			Payment struct {
				Entity service.RazorpayPayment `json:"entity"`
			} `json:"payment"`
		} `json:"payload"`
	}
	if err := json.Unmarshal(body, &event); err != nil {
		http.Error(w, "Invalid webhook event", http.StatusBadRequest)
		return
	}
	if event.Event == "payment.captured" {
		if err := h.svc.RecordRazorpayCapture(event.Payload.Payment.Entity); err != nil && !errors.Is(err, sql.ErrNoRows) {
			log.Printf("Razorpay capture could not be recorded: %v", err)
			http.Error(w, "Webhook could not be processed", http.StatusInternalServerError)
			return
		}
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *OrderHandler) HandleCancelOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	orderID := r.PathValue("id")
	if orderID == "" {
		orderID = r.URL.Query().Get("orderId")
	}
	if orderID == "" {
		var req struct {
			OrderID string `json:"orderId"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 32<<10)).Decode(&req); err == nil {
			orderID = req.OrderID
		}
	}
	if orderID == "" {
		writeOrderError(w, http.StatusBadRequest, "orderId is required")
		return
	}
	if _, ok := h.getAuthorizedOrder(w, r, orderID, false); !ok {
		return
	}
	if err := h.svc.CancelOrder(orderID); err != nil {
		if errors.Is(err, service.ErrPaymentNeedsConfirmation) {
			writeOrderError(w, http.StatusConflict, "This order cannot be cancelled while the payment is being confirmed or after it has been recorded.")
			return
		}
		writeOrderError(w, http.StatusServiceUnavailable, "Could not check whether the order can be cancelled. Please try again.")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"success": true, "message": "Order cancellation processed"})
}

func (h *OrderHandler) HandleGetOrder(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	role, _ := r.Context().Value(middleware.RoleKey).(string)
	isStaff := role == "admin" || role == "employee"
	orderID := r.URL.Query().Get("orderId")
	if orderID == "" {
		orderID = r.PathValue("id")
	}
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Content-Type", "application/json")
	if orderID != "" {
		if order, ok := h.getAuthorizedOrder(w, r, orderID, isStaff); ok {
			if r.URL.Query().Get("details") == "1" {
				if err := h.svc.LoadOrderDetails(order); err != nil {
					log.Printf("Could not load order details: %v", err)
					writeOrderError(w, http.StatusInternalServerError, "Could not load order details")
					return
				}
			}
			json.NewEncoder(w).Encode(order)
		}
		return
	}
	email := r.URL.Query().Get("email")
	if !isStaff {
		identity := middleware.CustomerFromContext(r.Context())
		if !identity.EmailVerified || identity.Email == "" {
			writeOrderError(w, http.StatusForbidden, "Verify your email to access your orders")
			return
		}
		email = identity.Email
	} else if email == "" && r.URL.Query().Get("userId") != "" && h.profileSvc != nil {
		profile, err := h.profileSvc.GetProfile(r.URL.Query().Get("userId"))
		if err != nil || profile == nil || profile.Email == "" {
			writeOrderError(w, http.StatusNotFound, "Customer not found")
			return
		}
		email = profile.Email
	}
	orders, err := h.svc.GetAllOrders(email)
	if err != nil {
		writeOrderError(w, http.StatusInternalServerError, "Could not load orders")
		return
	}
	if orders == nil {
		orders = []models.Order{}
	}
	json.NewEncoder(w).Encode(orders)
}

func (h *OrderHandler) getAuthorizedOrder(w http.ResponseWriter, r *http.Request, orderID string, allowStaff bool) (*models.Order, bool) {
	identity := middleware.CustomerFromContext(r.Context())
	if !allowStaff && (!identity.EmailVerified || identity.Email == "") {
		writeOrderError(w, http.StatusForbidden, "Verify your email to access this order")
		return nil, false
	}
	order, err := h.svc.GetOrder(orderID)
	if err != nil || order == nil || (!allowStaff && !strings.EqualFold(order.CustomerEmail, identity.Email)) {
		writeOrderError(w, http.StatusNotFound, "Order not found")
		return nil, false
	}
	return order, true
}

func writeOrderError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
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

	params := r.URL.Query()
	checkoutType := params.Get("checkout_type")
	if checkoutType == "" {
		checkoutType = "delivery"
	}
	quantity := 1
	var netPaise int64
	var err error
	if params.Has("cart_size") {
		quantity, err = strconv.Atoi(params.Get("cart_size"))
		if err != nil {
			writeOrderError(w, http.StatusBadRequest, "Invalid cart quantity")
			return
		}
	}
	if params.Has("net_paise") {
		netPaise, err = strconv.ParseInt(params.Get("net_paise"), 10, 64)
		if err != nil {
			writeOrderError(w, http.StatusBadRequest, "Invalid quote amount")
			return
		}
	}
	chargePaise, err := h.svc.QuoteDelivery(checkoutType, params.Get("city"), strings.TrimSpace(params.Get("pincode")), quantity, netPaise)
	if errors.Is(err, service.ErrInvalidDeliveryQuote) {
		writeOrderError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err != nil && !errors.Is(err, service.ErrDeliveryNotServiceable) {
		log.Printf("Delivery quote failed: %v", err)
		writeOrderError(w, http.StatusServiceUnavailable, "Delivery quotes are temporarily unavailable")
		return
	}
	w.Header().Set("Cache-Control", "no-store")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"serviceable": err == nil,
		"charge":      float64(chargePaise) / 100,
		"chargePaise": chargePaise,
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

	payload, err := io.ReadAll(http.MaxBytesReader(w, r.Body, 256<<10))
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	signature := r.Header.Get("X-Delhivery-Signature")
	signed := signature != "" && h.delhiverySvc.ValidateWebhookSignature(payload, signature)
	if !signed && !h.delhiverySvc.ValidateWebhookToken(r.Header.Get("X-Delhivery-Token")) {
		http.Error(w, "Invalid or missing webhook credentials", http.StatusUnauthorized)
		return
	}

	var data struct {
		Shipment       *service.DelhiveryShipment `json:"Shipment"`
		OrderID        string                     `json:"order_id"`
		Status         string                     `json:"status"`
		TrackingNumber string                     `json:"tracking_number"`
		UpdatedAt      string                     `json:"updated_at"`
	}
	if err := json.Unmarshal(payload, &data); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}
	if data.Shipment != nil {
		h.handleDelhiveryScan(w, data.Shipment)
		return
	}
	if !signed {
		http.Error(w, "Missing signature for legacy webhook", http.StatusUnauthorized)
		return
	}

	if data.OrderID == "" {
		http.Error(w, "Missing order_id", http.StatusBadRequest)
		return
	}

	if data.Status == "" {
		http.Error(w, "Missing status", http.StatusBadRequest)
		return
	}

	err = h.svc.ApplyCarrierTrackingUpdate(data.OrderID, data.Status, data.TrackingNumber, data.UpdatedAt)
	if err != nil {
		if errors.Is(err, service.ErrUnknownCarrierStatus) || errors.Is(err, repository.ErrInvalidShipmentTransition) {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		log.Printf("Could not persist Delhivery callback: %v", err)
		http.Error(w, "Could not apply carrier update", http.StatusServiceUnavailable)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *OrderHandler) handleDelhiveryScan(w http.ResponseWriter, shipment *service.DelhiveryShipment) {
	orderID, waybill := strings.TrimSpace(shipment.Reference), strings.TrimSpace(shipment.Waybill)
	if orderID == "" || len(orderID) > 100 || waybill == "" || len(waybill) > 64 {
		http.Error(w, "A valid order reference and waybill are required", http.StatusBadRequest)
		return
	}
	event, err := shipment.Status.Event()
	if errors.Is(err, service.ErrUnknownScan) {
		w.WriteHeader(http.StatusOK)
		return
	}
	if err != nil {
		http.Error(w, "Invalid carrier timestamp", http.StatusBadRequest)
		return
	}
	if err := h.svc.RecordShipmentEvent(orderID, waybill, event); err != nil {
		if errors.Is(err, repository.ErrInvalidShipmentTransition) {
			http.Error(w, "Shipment has not been matched to an order", http.StatusConflict)
			return
		}
		log.Printf("Could not save carrier scan: %v", err)
		http.Error(w, "Could not save carrier scan", http.StatusServiceUnavailable)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *OrderHandler) HandleTriggerDelhiveryBatch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	orderID := strings.TrimSpace(r.URL.Query().Get("orderId"))
	dispatched, failed, err := h.svc.DispatchPendingOrders(orderID)
	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		log.Printf("Delhivery dispatch: %v", err)
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"error": "Dispatch could not complete. Check the order status before retrying.", "dispatched": dispatched, "failed": failed,
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"dispatched": dispatched,
		"failed":     failed,
		"count":      dispatched,
	})
}

func (h *OrderHandler) HandleResolveDelhiveryDispatch(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeOrderError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}
	var req struct {
		OrderID            string `json:"orderId"`
		Waybill            string `json:"waybill"`
		ConfirmedNoBooking bool   `json:"confirmedNoBooking"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&req); err != nil {
		writeOrderError(w, http.StatusBadRequest, "Invalid dispatch review request")
		return
	}
	req.OrderID, req.Waybill = strings.TrimSpace(req.OrderID), strings.TrimSpace(req.Waybill)
	if req.OrderID == "" || (req.Waybill == "") != req.ConfirmedNoBooking || len(req.Waybill) > 64 || strings.Trim(req.Waybill, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-") != "" {
		writeOrderError(w, http.StatusBadRequest, "Provide a valid waybill or confirm that the carrier has no booking")
		return
	}
	if err := h.svc.ResolveDeliveryDispatch(req.OrderID, req.Waybill); err != nil {
		if errors.Is(err, repository.ErrInvalidShipmentTransition) {
			writeOrderError(w, http.StatusConflict, "This order is not ready for dispatch review")
			return
		}
		log.Printf("Could not resolve dispatch for %s: %v", req.OrderID, err)
		writeOrderError(w, http.StatusServiceUnavailable, "Could not save the dispatch review")
		return
	}
	log.Printf("Dispatch reviewed for %s by %v (confirmed no booking=%t)", req.OrderID, r.Context().Value(middleware.EmailKey), req.ConfirmedNoBooking)
	w.WriteHeader(http.StatusNoContent)
}

func (h *OrderHandler) HandleGetPreorderOrders(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	filter := r.URL.Query().Get("filter")
	searchQ := strings.ToLower(r.URL.Query().Get("q"))
	orderID := r.URL.Query().Get("orderId")

	orders, err := h.svc.GetPreorderPickupOrders(filter)
	if err != nil {
		http.Error(w, "Failed to fetch preorder orders", http.StatusInternalServerError)
		return
	}

	if orderID != "" {
		filtered := orders[:0]
		for _, o := range orders {
			if strings.EqualFold(o.ID, orderID) {
				filtered = append(filtered, o)
			}
		}
		orders = filtered
	} else if searchQ != "" {
		filtered := orders[:0]
		for _, o := range orders {
			if strings.Contains(strings.ToLower(o.ID), searchQ) ||
				strings.Contains(strings.ToLower(o.CustomerEmail), searchQ) ||
				strings.Contains(strings.ToLower(o.ShippingName), searchQ) {
				filtered = append(filtered, o)
			}
		}
		orders = filtered
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"orders": orders,
		"count":  len(orders),
	})
}

func (h *OrderHandler) HandleMarkPreorderPickupReady(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		OrderID string `json:"orderId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.OrderID == "" {
		http.Error(w, "Missing orderId", http.StatusBadRequest)
		return
	}

	if err := h.svc.MarkPreorderPickupReady(req.OrderID); err != nil {
		http.Error(w, "Failed to mark order as ready for pickup: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Send ready-for-pickup notification
	order, err := h.svc.GetOrder(req.OrderID)
	if err == nil {
		pickupCfg, _ := h.configSvc.GetPreorderPickupConfig()
		if pickupCfg == nil {
			pickupCfg = &models.PreorderPickupConfig{}
		}
		_ = h.svc.SendPickupReadyNotification(order, pickupCfg)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Order marked as ready for pickup and customer notified"})
}

func (h *OrderHandler) HandleMarkAllPreorderPickupReady(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	count, err := h.svc.MarkAllPreorderPickupReady()
	if err != nil {
		http.Error(w, "Failed to mark all orders as ready: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"count":   count,
		"message": fmt.Sprintf("Successfully marked %d order(s) as ready for pickup and notified customers", count),
	})
}

func (h *OrderHandler) HandleConfirmPreorderPickup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		OrderID string `json:"orderId"`
		Notes   string `json:"notes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.OrderID == "" {
		http.Error(w, "Missing orderId", http.StatusBadRequest)
		return
	}

	adminEmail, _ := r.Context().Value(middleware.EmailKey).(string)

	if err := h.svc.ConfirmPreorderPickup(req.OrderID, adminEmail, req.Notes); err != nil {
		http.Error(w, "Failed to confirm pickup: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if h.emailSvc != nil {
		if o, err := h.svc.GetOrder(req.OrderID); err == nil && o != nil {
			orderCopy := *o
			go func(order models.Order) {
				_ = h.emailSvc.SendOrderPickedUp(&order)
			}(orderCopy)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Pickup confirmed and order marked as collected"})
}

func (h *OrderHandler) HandleGetPreorderPickupAudit(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	orderID := r.PathValue("id")
	if orderID == "" {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		for i, part := range parts {
			if part == "orders" && i+1 < len(parts) {
				orderID = parts[i+1]
				break
			}
		}
	}
	if orderID == "" {
		http.Error(w, "Missing order ID", http.StatusBadRequest)
		return
	}

	entries, err := h.svc.GetPreorderPickupAudit(orderID)
	if err != nil {
		http.Error(w, "Failed to fetch audit trail", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"orderID": orderID,
		"audit":   entries,
	})
}
