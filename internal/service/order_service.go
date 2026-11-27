package service

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

type OrderService interface {
	CreateOrder(req *models.OrderCreateRequest) (*models.Order, string, string, error)
	QuoteDelivery(checkoutType, city, pin string, quantity int, netPaise int64) (int64, error)
	VerifyPayment(req *models.OrderVerifyRequest) (*models.OrderVerifyResponse, error)
	RecordRazorpayCapture(payment RazorpayPayment) error
	GetOrder(orderID string) (*models.Order, error)
	LoadOrderDetails(order *models.Order) error
	GetAllOrders(email string) ([]models.Order, error)
	GetOrdersPaginated(email string, limit, offset int, search, status, orderType string) ([]models.Order, int, error)
	ConfirmPickup(orderID string) error
	UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error
	ApplyCarrierTrackingUpdate(orderID, carrierStatus, trackingNumber, eventTime string) error
	RecordShipmentEvent(orderID, tracking string, event models.ShipmentEvent) error
	RefreshShipmentTracking(ctx context.Context) error
	CancelOrder(orderID string) error
	CleanupAbandonedOrders(cutoff time.Duration) (int, error)
	ConfirmPreorderPickup(orderID, adminEmail, notes string) error
	MarkPreorderPickupReady(orderID string) error
	MarkAllPreorderPickupReady() (int, error)
	GetPreorderPickupOrders(filter string) ([]models.Order, error)
	GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error)
	SendPickupReadyNotification(order *models.Order, pickupCfg *models.PreorderPickupConfig) error
	DispatchPendingOrders(orderID string) (dispatchedCount int, failedCount int, err error)
	ResolveDeliveryDispatch(orderID, tracking string) error
}

type orderService struct {
	loadSale           func() (models.Sale, error)
	orderRepo          repository.OrderRepository
	couponSvc          CouponService
	productRepo        repository.ProductRepository
	configSvc          ConfigService
	delhiverySvc       DelhiveryService
	onPaymentConfirmed func(*models.Order)
}

func (s *orderService) SetSaleLoader(load func() (models.Sale, error)) { s.loadSale = load }

type PriceChangedError struct{ TotalPaise int64 }

func (e *PriceChangedError) Error() string {
	return "Order total has changed. Review it before paying."
}

func NewOrderService(orderRepo repository.OrderRepository, couponSvc CouponService, productRepo repository.ProductRepository, configSvc ConfigService, delhiverySvc DelhiveryService) *orderService {
	return &orderService{
		orderRepo:    orderRepo,
		couponSvc:    couponSvc,
		productRepo:  productRepo,
		configSvc:    configSvc,
		delhiverySvc: delhiverySvc,
	}
}

func (s *orderService) SetPaymentConfirmedHandler(handler func(*models.Order)) {
	s.onPaymentConfirmed = handler
}

func createRazorpayOrder(amount float64, receipt string, keyID string, keySecret string) (string, error) {
	amountInPaisa := int(math.Round(amount * 100))
	payload := map[string]interface{}{
		"amount":   amountInPaisa,
		"currency": "INR",
		"receipt":  receipt,
	}
	jsonBody, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", "https://api.razorpay.com/v1/orders", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}
	req.SetBasicAuth(keyID, keySecret)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("razorpay API status %d", resp.StatusCode)
	}

	var rzpResp struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(&rzpResp); err != nil {
		return "", err
	}
	if !strings.HasPrefix(rzpResp.ID, "order_") {
		return "", errors.New("payment gateway returned an invalid order ID")
	}
	return rzpResp.ID, nil
}

var ErrInvalidDeliveryQuote = errors.New("invalid delivery quote details")

func (s *orderService) QuoteDelivery(checkoutType, city, pin string, quantity int, netPaise int64) (int64, error) {
	if s.configSvc == nil {
		return 0, errors.New("checkout configuration is unavailable")
	}
	cfg, err := s.configSvc.GetCheckoutConfig()
	if err != nil {
		return 0, fmt.Errorf("load checkout configuration: %w", err)
	}
	if cfg == nil {
		return 0, errors.New("checkout configuration is unavailable")
	}
	return s.quoteDelivery(*cfg, checkoutType, city, pin, quantity, netPaise)
}

func (s *orderService) quoteDelivery(cfg models.CheckoutConfig, checkoutType, city, pin string, quantity int, netPaise int64) (int64, error) {
	if (checkoutType != "delivery" && checkoutType != "hyderabad_instant") || len(pin) != 6 || strings.Trim(pin, "0123456789") != "" || quantity < 1 || quantity > math.MaxInt/500 || netPaise < 0 {
		return 0, ErrInvalidDeliveryQuote
	}
	if checkoutType == "hyderabad_instant" {
		city = strings.ToLower(strings.TrimSpace(city))
		if !cfg.HyderabadInstantEnabled || (city != "hyderabad" && city != "secunderabad") || !strings.HasPrefix(pin, "500") {
			return 0, ErrDeliveryNotServiceable
		}
	} else if !cfg.StandardDeliveryEnabled {
		return 0, ErrDeliveryNotServiceable
	}
	if s.delhiverySvc == nil {
		return 0, ErrCarrierNotConfigured
	}
	serviceable, charge, err := s.delhiverySvc.CheckServiceability(pin, quantity*500)
	if err != nil {
		return 0, fmt.Errorf("check carrier serviceability: %w", err)
	}
	if !serviceable {
		return 0, ErrDeliveryNotServiceable
	}
	threshold := cfg.FreeShippingThreshold
	if threshold == 0 {
		threshold = 1449
	}
	if netPaise >= int64(math.Round(threshold*100)) {
		return 0, nil
	}
	return int64(math.Round(math.Max(59, charge) * 100)), nil
}

func (s *orderService) CreateOrder(req *models.OrderCreateRequest) (*models.Order, string, string, error) {
	if len(req.Items) == 0 {
		return nil, "", "", errors.New("no items in order")
	}
	switch req.PaymentMethod {
	case "":
		req.PaymentMethod = "online"
	case "online":
	case "offline_qr":
		if req.CheckoutType != "pickup" || req.IsPreorder {
			return nil, "", "", errors.New("pay in store is only available for regular pickup")
		}
	default:
		return nil, "", "", errors.New("unsupported payment method")
	}

	var checkoutConfig models.CheckoutConfig
	if s.configSvc != nil {
		if c, err := s.configSvc.GetCheckoutConfig(); err == nil && c != nil {
			checkoutConfig = *c
		}
	} else {
		checkoutConfig = models.CheckoutConfig{
			StandardDeliveryEnabled:      true,
			HyderabadInstantEnabled:      true,
			StorePickupPrepayEnabled:     true,
			StorePickupPayInStoreEnabled: true,
			FreeShippingThreshold:        1449.0,
		}
	}

	// Validate checkout method against server configuration
	switch req.CheckoutType {
	case "delivery":
		if !checkoutConfig.StandardDeliveryEnabled {
			return nil, "", "", errors.New("standard delivery checkout is currently disabled")
		}
	case "hyderabad_instant":
		if !checkoutConfig.HyderabadInstantEnabled {
			return nil, "", "", errors.New("hyderabad instant delivery is currently disabled")
		}
	case "pickup":
		if req.PaymentMethod == "offline_qr" {
			if !checkoutConfig.StorePickupPayInStoreEnabled {
				return nil, "", "", errors.New("pay in store for pickup is currently disabled")
			}
		} else {
			if !checkoutConfig.StorePickupPrepayEnabled {
				return nil, "", "", errors.New("prepaid store pickup is currently disabled")
			}
		}
	default:
		return nil, "", "", fmt.Errorf("invalid or unsupported checkout type: %s", req.CheckoutType)
	}

	var subtotal float64
	var orderItems []models.OrderItem
	var saleSavings int64
	var sale models.Sale
	if s.loadSale != nil {
		configured, err := s.loadSale()
		if err != nil {
			return nil, "", "", fmt.Errorf("load sale pricing: %w", err)
		}
		if configured.Active(time.Now()) {
			sale = configured
		}
	}

	var hasPreorderItem bool
	var hasRegularItem bool

	for _, item := range req.Items {
		if item.Quantity <= 0 {
			return nil, "", "", errors.New("quantity must be greater than zero")
		}

		filters := map[string]string{"id": item.ProductID}
		products, _, err := s.productRepo.GetProducts(filters)
		if err != nil || len(products) == 0 {
			filters = map[string]string{"q": item.ProductID}
			products, _, err = s.productRepo.GetProducts(filters)
		}
		if err != nil || len(products) == 0 {
			return nil, "", "", fmt.Errorf("product %s not found", item.ProductID)
		}

		p := products[0]

		// Derive preorder eligibility strictly from the catalog
		if p.IsPreorder {
			hasPreorderItem = true
		} else {
			hasRegularItem = true
		}

		// Reject missing size for sized products
		if len(p.Sizes) > 0 || len(p.SizesStock) > 0 {
			if strings.TrimSpace(item.Size) == "" {
				return nil, "", "", fmt.Errorf("size is required for sized product %s (%s)", p.Name, p.ID)
			}
		}

		subtotal += p.Price * float64(item.Quantity)
		saleSavings += sale.UnitSavings(p) * int64(item.Quantity)
		orderItems = append(orderItems, models.OrderItem{
			ProductID:   item.ProductID,
			Quantity:    item.Quantity,
			PriceAtQty:  p.Price,
			Size:        item.Size,
			ProductName: p.Name,
			IsPreorder:  p.IsPreorder,
		})
	}

	// Reject mixed carts (cannot mix preorder items and regular stock in the same order)
	if hasPreorderItem && hasRegularItem {
		return nil, "", "", errors.New("cannot mix preorder items and regular stock items in the same order")
	}

	// Validate requested fulfillment type against items
	if hasPreorderItem {
		if req.PaymentMethod != "online" || !((req.FulfilmentType == models.FulfilmentTypePreorderHomeDelivery && req.CheckoutType == "delivery") || (req.FulfilmentType == models.FulfilmentTypePreorderStorePickup && req.CheckoutType == "pickup")) {
			return nil, "", "", errors.New("preorder fulfilment must match the selected delivery or prepaid pickup method")
		}
		req.IsPreorder = true
	} else {
		if req.FulfilmentType == models.FulfilmentTypePreorderHomeDelivery || req.FulfilmentType == models.FulfilmentTypePreorderStorePickup {
			return nil, "", "", errors.New("preorder fulfilment type selected for non-preorder catalog items")
		}
		req.IsPreorder = false
	}

	var discountAmt float64
	appliedCouponCode := ""
	if req.CouponCode != "" {
		cartItemsInfo := make([]models.CartItemInfo, len(orderItems))
		for i, item := range orderItems {
			cartItemsInfo[i] = models.CartItemInfo{
				ProductID: item.ProductID,
				Price:     item.PriceAtQty,
				Quantity:  item.Quantity,
			}
		}

		_, amt, err := s.couponSvc.ValidateCoupon(req.CouponCode, subtotal, cartItemsInfo, req.UserID)
		if err == nil {
			discountAmt = amt
			if amt > 0 {
				appliedCouponCode = req.CouponCode
			}
		} else {
			return nil, "", "", fmt.Errorf("invalid coupon: %v", err)
		}
	}
	if saleSavings > 0 && float64(saleSavings)/100 >= discountAmt {
		discountAmt = float64(saleSavings) / 100
		appliedCouponCode = ""
	}

	finalTotal := subtotal - discountAmt

	var shippingCost float64
	isDelivery := req.CheckoutType == "delivery" || req.CheckoutType == "hyderabad_instant"
	if isDelivery {
		if strings.TrimSpace(req.ShippingName) == "" {
			return nil, "", "", errors.New("shipping recipient name is required")
		}
		if strings.TrimSpace(req.ShippingPhone) == "" || strings.TrimSpace(req.ShippingPhone) == "0000000000" {
			return nil, "", "", errors.New("valid contact phone number is required")
		}
		if strings.TrimSpace(req.ShippingAddress) == "" {
			return nil, "", "", errors.New("shipping street address is required")
		}
		if strings.TrimSpace(req.ShippingCity) == "" {
			return nil, "", "", errors.New("shipping city is required")
		}
		if strings.TrimSpace(req.ShippingState) == "" {
			return nil, "", "", errors.New("shipping state is required")
		}
		cleanPin := strings.TrimSpace(req.ShippingZIPCode)
		totalQuantity := 0
		for _, item := range req.Items {
			if item.Quantity > math.MaxInt/500-totalQuantity {
				return nil, "", "", ErrInvalidDeliveryQuote
			}
			totalQuantity += item.Quantity
		}
		feePaise, err := s.quoteDelivery(checkoutConfig, req.CheckoutType, req.ShippingCity, cleanPin, totalQuantity, int64(math.Round(finalTotal*100)))
		if err != nil {
			return nil, "", "", err
		}
		shippingCost = float64(feePaise) / 100
		req.ShippingZIPCode = cleanPin
	}
	finalTotal += shippingCost

	var pickupLocationSnapshot string
	if req.FulfilmentType == models.FulfilmentTypePreorderStorePickup {
		shippingCost = 0
		finalTotal = subtotal - discountAmt
		snapshotCfg := models.PreorderPickupConfig{
			LocationName: "The Ethnic Touch Flagship Store",
			Address:      "ESCI road, Kajaguda lake.",
			City:         "Hyderabad",
			State:        "Telangana",
			ZipCode:      "500032",
			Availability: "Fri - Sun, 7PM - 11PM",
		}
		if pickupCfg, cfgErr := s.configSvc.GetPreorderPickupConfig(); cfgErr == nil && pickupCfg != nil {
			if pickupCfg.LocationName != "" {
				snapshotCfg.LocationName = pickupCfg.LocationName
			}
			if pickupCfg.Address != "" {
				snapshotCfg.Address = pickupCfg.Address
			}
			if pickupCfg.City != "" {
				snapshotCfg.City = pickupCfg.City
			}
			if pickupCfg.State != "" {
				snapshotCfg.State = pickupCfg.State
			}
			if pickupCfg.ZipCode != "" {
				snapshotCfg.ZipCode = pickupCfg.ZipCode
			}
			if pickupCfg.Availability != "" {
				snapshotCfg.Availability = pickupCfg.Availability
			}
			if pickupCfg.EstimatedPickupDate != "" {
				snapshotCfg.EstimatedPickupDate = pickupCfg.EstimatedPickupDate
			}
			if pickupCfg.ContactInfo != "" {
				snapshotCfg.ContactInfo = pickupCfg.ContactInfo
			}
			if pickupCfg.MapsLink != "" {
				snapshotCfg.MapsLink = pickupCfg.MapsLink
			}
			if pickupCfg.Instructions != "" {
				snapshotCfg.Instructions = pickupCfg.Instructions
			}
		}
		if snapshotBytes, marshalErr := json.Marshal(snapshotCfg); marshalErr == nil {
			pickupLocationSnapshot = string(snapshotBytes)
		}
	}

	// Use the same rounded amount for both the stored order and the gateway.
	finalTotal = math.Round(finalTotal*100) / 100
	if req.ExpectedTotalPaise != nil && *req.ExpectedTotalPaise != int64(math.Round(finalTotal*100)) {
		return nil, "", "", &PriceChangedError{TotalPaise: int64(math.Round(finalTotal * 100))}
	}
	randBytes := make([]byte, 4)
	if _, err := rand.Read(randBytes); err != nil {
		randBytes = []byte{byte(time.Now().UnixNano()), byte(time.Now().UnixNano() >> 8), byte(time.Now().UnixNano() >> 16), byte(time.Now().UnixNano() >> 24)}
	}
	orderID := fmt.Sprintf("ORD_%d_%s", time.Now().Unix(), hex.EncodeToString(randBytes))

	var providerOrderID string
	var checkoutURL string
	orderStatus := "pending"

	if req.PaymentMethod == "offline_qr" {
		providerOrderID = "OFFLINE_QR"
		checkoutURL = "/checkout-success"
		orderStatus = "pending_payment"
	} else {
		keyID := os.Getenv("RAZORPAY_KEY_ID")
		keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

		if keyID == "" || keySecret == "" {
			return nil, "", "", errors.New("online payment is temporarily unavailable")
		}
		rzpOrderID, err := createRazorpayOrder(finalTotal, orderID, keyID, keySecret)
		if err != nil {
			slog.Error("Razorpay API order creation failed", "error", err)
			return nil, "", "", errors.New("online payment is temporarily unavailable")
		}
		providerOrderID = rzpOrderID
		checkoutURL = "razorpay"
	}

	order := &models.Order{
		ID:                     orderID,
		CustomerEmail:          req.CustomerEmail,
		TotalAmount:            finalTotal,
		DiscountAmt:            discountAmt,
		CouponCode:             appliedCouponCode,
		Status:                 orderStatus,
		CreatedAt:              time.Now().Format(time.RFC3339),
		RazorpayOrderID:        providerOrderID,
		ShippingName:           req.ShippingName,
		ShippingPhone:          req.ShippingPhone,
		ShippingAddress:        req.ShippingAddress,
		ShippingCity:           req.ShippingCity,
		ShippingState:          req.ShippingState,
		ShippingZIPCode:        req.ShippingZIPCode,
		CheckoutType:           req.CheckoutType,
		PaymentMethod:          req.PaymentMethod,
		Items:                  orderItems,
		FulfilmentType:         req.FulfilmentType,
		IsPreorder:             req.IsPreorder,
		PickupLocationSnapshot: pickupLocationSnapshot,
	}

	err := s.orderRepo.CreateOrderWithTransaction(order, nil, appliedCouponCode)
	if err != nil {
		return nil, "", "", err
	}

	return order, providerOrderID, checkoutURL, nil
}

// RazorpayPayment is the provider payment entity used by the API and signed webhooks.
type RazorpayPayment struct {
	ID       string `json:"id"`
	OrderID  string `json:"order_id"`
	Amount   int64  `json:"amount"`
	Currency string `json:"currency"`
	Status   string `json:"status"`
	Captured bool   `json:"captured"`
}

var ErrPaymentNeedsConfirmation = errors.New("payment status is pending confirmation")

func checkRazorpaySignature(message, signature, secret string) bool {
	provided, err := hex.DecodeString(signature)
	if err != nil || secret == "" {
		return false
	}
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(message))
	return hmac.Equal(provided, mac.Sum(nil))
}

var razorpayHTTPClient = &http.Client{Timeout: 8 * time.Second}

func fetchRazorpay(path string, response any) error {
	keyID, secret := os.Getenv("RAZORPAY_KEY_ID"), os.Getenv("RAZORPAY_KEY_SECRET")
	if keyID == "" || secret == "" {
		return errors.New("payment gateway configuration missing")
	}
	req, err := http.NewRequest(http.MethodGet, "https://api.razorpay.com/v1/"+path, nil)
	if err != nil {
		return err
	}
	req.SetBasicAuth(keyID, secret)

	resp, err := razorpayHTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("fetch Razorpay status: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("Razorpay status lookup returned HTTP %d", resp.StatusCode)
	}
	return json.NewDecoder(io.LimitReader(resp.Body, 1<<20)).Decode(response)
}

func (s *orderService) VerifyPayment(req *models.OrderVerifyRequest) (*models.OrderVerifyResponse, error) {
	order, err := s.orderRepo.GetOrder(req.OrderID)
	if err != nil {
		return nil, fmt.Errorf("get order for verification: %w", err)
	}
	if order.PaymentMethod != "online" {
		return nil, errors.New("order is not payable online")
	}
	if req.Mock {
		return nil, errors.New("simulated payment verification is disabled")
	}
	if !strings.HasPrefix(order.RazorpayOrderID, "order_") || req.RazorpayOrderID != order.RazorpayOrderID ||
		!strings.HasPrefix(req.RazorpayPaymentID, "pay_") ||
		!checkRazorpaySignature(order.RazorpayOrderID+"|"+req.RazorpayPaymentID, req.RazorpaySignature, os.Getenv("RAZORPAY_KEY_SECRET")) {
		return nil, errors.New("invalid payment verification details")
	}
	var payment RazorpayPayment
	if err := fetchRazorpay("payments/"+url.PathEscape(req.RazorpayPaymentID), &payment); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrPaymentNeedsConfirmation, err)
	}
	if payment.ID != req.RazorpayPaymentID {
		return nil, errors.New("provider payment ID does not match the checkout")
	}
	return s.confirmRazorpayPayment(order, payment)
}

func (s *orderService) RecordRazorpayCapture(payment RazorpayPayment) error {
	if !strings.HasPrefix(payment.OrderID, "order_") {
		return errors.New("invalid Razorpay order ID")
	}
	order, err := s.orderRepo.GetOrderByRazorpayID(payment.OrderID)
	if err != nil {
		return fmt.Errorf("find order for Razorpay payment: %w", err)
	}
	_, err = s.confirmRazorpayPayment(order, payment)
	return err
}

func (s *orderService) confirmRazorpayPayment(order *models.Order, payment RazorpayPayment) (*models.OrderVerifyResponse, error) {
	if order.PaymentMethod != "online" || !strings.HasPrefix(payment.ID, "pay_") ||
		payment.OrderID != order.RazorpayOrderID || payment.Currency != "INR" ||
		payment.Amount <= 0 || payment.Amount != int64(math.Round(order.TotalAmount*100)) {
		return nil, errors.New("payment does not match the stored order")
	}
	if payment.Status != "captured" || !payment.Captured {
		return nil, ErrPaymentNeedsConfirmation
	}
	return s.completePayment(order, payment.ID)
}

func (s *orderService) completePayment(order *models.Order, paymentID string) (*models.OrderVerifyResponse, error) {
	status, changed, err := s.orderRepo.RecordCapturedPayment(order.ID, paymentID)
	if err != nil {
		return nil, err
	}
	response := &models.OrderVerifyResponse{
		Message:                "Payment confirmed",
		Status:                 status,
		UnlockedGift:           order.UnlockedGift,
		TrackingNumber:         order.TrackingNumber,
		CheckoutType:           order.CheckoutType,
		FulfilmentType:         order.FulfilmentType,
		IsPreorder:             order.IsPreorder,
		PickupLocationSnapshot: order.PickupLocationSnapshot,
		Amount:                 order.TotalAmount,
	}
	if status == "payment_review" {
		response.Message = "Payment received. The store is reviewing this order."
		if changed {
			slog.Warn("Payment captured after order cancellation", "order_id", order.ID)
		}
		return response, nil
	}
	if status == "paid" && response.UnlockedGift == "" && s.couponSvc != nil {
		if err := s.awardOrderGift(order, response); err != nil {
			slog.Error("Payment confirmed but reward could not be saved", "order_id", order.ID, "error", err)
		}
	}
	if status == "paid" && changed && s.onPaymentConfirmed != nil {
		confirmedOrder := *order
		confirmedOrder.Status = status
		confirmedOrder.RazorpayPaymentID = paymentID
		confirmedOrder.UnlockedGift = response.UnlockedGift
		s.onPaymentConfirmed(&confirmedOrder)
	}
	return response, nil
}

func (s *orderService) awardOrderGift(order *models.Order, response *models.OrderVerifyResponse) error {
	tiers, err := s.couponSvc.GetGiftTiers()
	if err != nil {
		return err
	}
	var highest *models.GiftTier
	for i := range tiers {
		tier := &tiers[i]
		if order.TotalAmount >= tier.Threshold && (highest == nil || tier.Threshold > highest.Threshold) {
			highest = tier
		}
	}
	if highest == nil {
		return nil
	}

	gift := highest.PhysicalName
	var coupon *models.Coupon
	switch highest.RewardType {
	case "physical":
		if gift == "" {
			return nil
		}
	case "coupon":
		var randomness [8]byte
		if _, err := rand.Read(randomness[:]); err != nil {
			return err
		}
		suffix := strings.ToUpper(hex.EncodeToString(randomness[:]))
		format := strings.TrimSpace(highest.CouponFormat)
		if format == "" {
			format = "GFT-[RAND]"
		}
		if !strings.Contains(format, "[RAND]") {
			format += "-[RAND]"
		}
		gift = strings.ToUpper(strings.ReplaceAll(format, "[RAND]", suffix))
		expiry := time.Now().AddDate(0, 1, 0)
		if highest.CouponExpiryDays > 0 {
			expiry = time.Now().AddDate(0, 0, highest.CouponExpiryDays)
		}
		coupon = &models.Coupon{
			ID: models.OrderGiftCouponIDPrefix + order.ID, Code: gift, Type: highest.DiscountType,
			Value: highest.DiscountValue, UsageLimit: 1, IsActive: true, ExpiryDate: expiry.Format(time.RFC3339),
		}
	default:
		return nil
	}
	savedGift, err := s.orderRepo.SaveOrderGift(order.ID, gift, coupon)
	if err != nil {
		return err
	}
	response.UnlockedGift = savedGift
	response.GiftType = highest.RewardType
	if coupon != nil {
		response.GiftCode = savedGift
		if savedGift == coupon.Code {
			response.GiftExpiryDate = coupon.ExpiryDate
		}
	}
	return nil
}

func (s *orderService) GetOrder(orderID string) (*models.Order, error) {
	return s.orderRepo.GetOrder(orderID)
}

func (s *orderService) LoadOrderDetails(order *models.Order) error {
	return s.orderRepo.GetOrderDetails(order)
}

func (s *orderService) RecordShipmentEvent(orderID, tracking string, event models.ShipmentEvent) error {
	return s.orderRepo.RecordShipmentEvent(orderID, tracking, event)
}

func (s *orderService) RefreshShipmentTracking(ctx context.Context) error {
	if s.delhiverySvc == nil {
		return ErrCarrierNotConfigured
	}
	orders, err := s.orderRepo.ClaimTrackingOrders()
	if err != nil || len(orders) == 0 {
		return err
	}
	waybills := make([]string, 0, len(orders))
	for _, order := range orders {
		waybills = append(waybills, order.TrackingNumber)
	}
	events, err := s.delhiverySvc.FetchTracking(ctx, waybills)
	if err != nil {
		return err
	}
	var saveErrors []error
	for _, order := range orders {
		for _, event := range events[order.TrackingNumber] {
			if err := s.RecordShipmentEvent(order.ID, order.TrackingNumber, event); err != nil {
				saveErrors = append(saveErrors, err)
				break
			}
		}
	}
	return errors.Join(saveErrors...)
}

func (s *orderService) GetAllOrders(email string) ([]models.Order, error) {
	return s.orderRepo.GetAllOrders(email)
}

func (s *orderService) GetOrdersPaginated(email string, limit, offset int, search, status, orderType string) ([]models.Order, int, error) {
	return s.orderRepo.GetOrdersPaginated(email, limit, offset, search, status, orderType)
}

func (s *orderService) ConfirmPickup(orderID string) error {
	return s.orderRepo.ConfirmStorePickup(orderID)
}

func (s *orderService) CleanupAbandonedOrders(cutoff time.Duration) (int, error) {
	orders, err := s.orderRepo.GetAllOrders("")
	if err != nil {
		return 0, err
	}

	cleanedCount := 0
	thresholdTimeStandard := time.Now().Add(-cutoff)
	thresholdTimePickup := time.Now().Add(-48 * time.Hour)

	for _, o := range orders {
		if o.Status == "pending" || o.Status == "pending_payment" {
			createdAt, parseErr := time.Parse(time.RFC3339, o.CreatedAt)
			if parseErr == nil {
				isPickup := o.CheckoutType == "pickup" || o.PaymentMethod == "offline_qr"

				shouldCancel := false
				if isPickup {
					shouldCancel = createdAt.Before(thresholdTimePickup)
				} else {
					shouldCancel = createdAt.Before(thresholdTimeStandard)
				}

				if shouldCancel {
					if cancelErr := s.cancelPendingOrder(&o); cancelErr == nil {
						cleanedCount++
					} else if !errors.Is(cancelErr, ErrPaymentNeedsConfirmation) {
						slog.Warn("Could not reconcile pending order", "order_id", o.ID, "error", cancelErr)
					}
				}
			}
		}
	}
	return cleanedCount, nil
}

func (s *orderService) CancelOrder(orderID string) error {
	order, err := s.orderRepo.GetOrder(orderID)
	if err != nil {
		return err
	}
	return s.cancelPendingOrder(order)
}

func (s *orderService) cancelPendingOrder(order *models.Order) error {
	if order.Status != "pending" && order.Status != "pending_payment" {
		return ErrPaymentNeedsConfirmation
	}
	if strings.HasPrefix(order.RazorpayOrderID, "order_") {
		var payments struct {
			Items []RazorpayPayment `json:"items"`
		}
		if err := fetchRazorpay("orders/"+url.PathEscape(order.RazorpayOrderID)+"/payments", &payments); err != nil {
			return err
		}
		if payments.Items == nil {
			return errors.New("invalid provider payments response")
		}
		for _, payment := range payments.Items {
			if payment.Status == "captured" || payment.Captured {
				if _, err := s.confirmRazorpayPayment(order, payment); err != nil {
					return err
				}
				return ErrPaymentNeedsConfirmation
			}
		}
		for _, payment := range payments.Items {
			if payment.Status != "failed" {
				return ErrPaymentNeedsConfirmation
			}
		}
	}
	return s.orderRepo.CancelPendingOrder(order.ID)
}

func (s *orderService) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	return s.orderRepo.UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift)
}

var ErrUnknownCarrierStatus = errors.New("unrecognized carrier status")

func (s *orderService) ApplyCarrierTrackingUpdate(orderID, carrierStatus, trackingNumber, eventTime string) error {
	var targetStatus string
	switch carrierStatus {
	case "In Transit", "Dispatched", "Picked Up":
		targetStatus = "shipped"
	case "Delivered":
		targetStatus = "delivered"
	default:
		return ErrUnknownCarrierStatus
	}
	parsed, err := time.Parse(time.RFC3339, eventTime)
	if err != nil {
		parsed = time.Now()
	}
	return s.orderRepo.ApplyCarrierTrackingUpdate(orderID, targetStatus, strings.TrimSpace(trackingNumber), parsed.UTC().Format(time.RFC3339))
}

func (s *orderService) ConfirmPreorderPickup(orderID, adminEmail, notes string) error {
	err := s.orderRepo.ConfirmPreorderPickup(orderID, adminEmail, notes)
	if err != nil && err.Error() == "order already collected" {
		return nil
	}
	return err
}

func (s *orderService) MarkPreorderPickupReady(orderID string) error {
	return s.orderRepo.MarkPreorderPickupReady(orderID)
}

func (s *orderService) MarkAllPreorderPickupReady() (int, error) {
	count, err := s.orderRepo.MarkAllPreorderPickupReady()
	if err != nil {
		return 0, err
	}

	go func() {
		orders, err := s.orderRepo.GetPreorderPickupOrders("ready_for_pickup")
		if err == nil {
			pickupCfg, _ := s.configSvc.GetPreorderPickupConfig()
			if pickupCfg == nil {
				pickupCfg = &models.PreorderPickupConfig{}
			}
			for i := range orders {
				_ = s.SendPickupReadyNotification(&orders[i], pickupCfg)
			}
		}
	}()

	return count, nil
}

func (s *orderService) GetPreorderPickupOrders(filter string) ([]models.Order, error) {
	return s.orderRepo.GetPreorderPickupOrders(filter)
}

func (s *orderService) GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error) {
	return s.orderRepo.GetPreorderPickupAudit(orderID)
}

func (s *orderService) SendPickupReadyNotification(order *models.Order, pickupCfg *models.PreorderPickupConfig) error {
	if order.PickupNotificationSent {
		return nil
	}
	snapshotCfg := pickupCfg
	if order.PickupLocationSnapshot != "" {
		var snapshot models.PreorderPickupConfig
		if err := json.Unmarshal([]byte(order.PickupLocationSnapshot), &snapshot); err == nil {
			snapshotCfg = &snapshot
		}
	}
	mapsInfo := ""
	if snapshotCfg.MapsLink != "" {
		mapsInfo = " | Maps: " + snapshotCfg.MapsLink
	}
	fmt.Printf("[PICKUP NOTIFICATION] Order: %s | Customer: %s | Location: %s | Address: %s%s | Instructions: %s | Availability: %s | Contact: %s | Pickup Date: %s\n",
		order.ID, order.CustomerEmail, snapshotCfg.LocationName, snapshotCfg.Address,
		mapsInfo, snapshotCfg.Instructions, snapshotCfg.Availability,
		snapshotCfg.ContactInfo, snapshotCfg.EstimatedPickupDate)
	return s.orderRepo.MarkPickupNotificationSent(order.ID)
}

func (s *orderService) ResolveDeliveryDispatch(orderID, tracking string) error {
	return s.orderRepo.ResolveDeliveryDispatch(orderID, tracking)
}

func (s *orderService) DispatchPendingOrders(orderID string) (dispatchedCount int, failedCount int, err error) {
	if s.delhiverySvc == nil {
		return 0, 0, errors.New("delhivery service is not configured")
	}

	claimedOrders, err := s.orderRepo.ClaimPendingDeliveryOrders(50, orderID)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to claim pending delivery orders: %w", err)
	}
	if len(claimedOrders) == 0 {
		return 0, 0, nil
	}

	results, batchErr := s.delhiverySvc.BatchPickup(claimedOrders)
	var saveErrors []error
	for _, o := range claimedOrders {
		status, tracking, reason := "dispatch_review", "", "Verify the booking with the carrier before retrying"
		res := results[o.ID]
		switch {
		case errors.Is(batchErr, ErrCarrierNotConfigured):
			status, reason = "paid", "Delivery carrier credentials are missing"
		case batchErr == nil && res.Success && strings.TrimSpace(res.TrackingNumber) != "":
			status, tracking, reason = "shipped", strings.TrimSpace(res.TrackingNumber), ""
		case batchErr == nil && res.Rejected && strings.TrimSpace(res.TrackingNumber) == "":
			status, reason = "paid", "Carrier booking rejected"
		}
		if saveErr := s.orderRepo.FinishDeliveryDispatch(o.ID, o.DispatchStartedAt, status, tracking, reason); saveErr != nil {
			saveErrors = append(saveErrors, fmt.Errorf("record dispatch for %s: %w", o.ID, saveErr))
			failedCount++
			continue
		}
		if status == "shipped" {
			dispatchedCount++
		} else {
			failedCount++
		}
	}
	return dispatchedCount, failedCount, errors.Join(batchErr, errors.Join(saveErrors...))
}
