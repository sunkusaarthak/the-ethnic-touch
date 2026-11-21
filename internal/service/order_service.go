package service

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"math"
	"net/http"
	"os"
	"strings"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

type OrderService interface {
	CreateOrder(req *models.OrderCreateRequest) (*models.Order, string, string, error)
	VerifyPayment(req *models.OrderVerifyRequest) (*models.OrderVerifyResponse, error)
	GetOrder(orderID string) (*models.Order, error)
	GetAllOrders(email string) ([]models.Order, error)
	ConfirmPickup(orderID string) error
	UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error
	CancelOrder(orderID string) error
	CleanupAbandonedOrders(cutoff time.Duration) (int, error)
	ConfirmPreorderPickup(orderID, adminEmail, notes string) error
	MarkPreorderPickupReady(orderID string) error
	MarkAllPreorderPickupReady() (int, error)
	GetPreorderPickupOrders(filter string) ([]models.Order, error)
	GetPreorderPickupAudit(orderID string) ([]models.PreorderPickupAuditEntry, error)
	SendPickupReadyNotification(order *models.Order, pickupCfg *models.PreorderPickupConfig) error
}

type orderService struct {
	orderRepo    repository.OrderRepository
	couponSvc    CouponService
	productRepo  repository.ProductRepository
	configSvc    ConfigService
	delhiverySvc DelhiveryService
}

func NewOrderService(orderRepo repository.OrderRepository, couponSvc CouponService, productRepo repository.ProductRepository, configSvc ConfigService, delhiverySvc DelhiveryService) OrderService {
	return &orderService{
		orderRepo:    orderRepo,
		couponSvc:    couponSvc,
		productRepo:  productRepo,
		configSvc:    configSvc,
		delhiverySvc: delhiverySvc,
	}
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
		respBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("razorpay api status %d: %s", resp.StatusCode, string(respBytes))
	}

	var rzpResp struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&rzpResp); err != nil {
		return "", err
	}
	return rzpResp.ID, nil
}

func (s *orderService) CreateOrder(req *models.OrderCreateRequest) (*models.Order, string, string, error) {
	if len(req.Items) == 0 {
		return nil, "", "", errors.New("no items in order")
	}

	// Validate preorder fulfilment type
	if req.IsPreorder {
		if req.FulfilmentType != models.FulfilmentTypePreorderHomeDelivery && req.FulfilmentType != models.FulfilmentTypePreorderStorePickup {
			return nil, "", "", errors.New("invalid preorder fulfilment type: must be PREORDER_HOME_DELIVERY or PREORDER_STORE_PICKUP")
		}
	}

	var subtotal float64
	var orderItems []models.OrderItem

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
		subtotal += p.Price * float64(item.Quantity)
		orderItems = append(orderItems, models.OrderItem{
			ProductID:   item.ProductID,
			Quantity:    item.Quantity,
			PriceAtQty:  p.Price,
			Size:        item.Size,
			ProductName: p.Name,
		})
	}

	var discountAmt float64
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
		} else {
			return nil, "", "", fmt.Errorf("invalid coupon: %v", err)
		}
	}

	finalTotal := subtotal - discountAmt

	cfg, _ := s.configSvc.GetCheckoutConfig()
	threshold := cfg.FreeShippingThreshold
	if threshold == 0 {
		threshold = 1449.0
	}

	var shippingCost float64
	if req.CheckoutType == "delivery" && req.FulfilmentType != models.FulfilmentTypePreorderStorePickup && finalTotal < threshold && req.ShippingZIPCode != "" {
		totalQuantity := 0
		for _, item := range req.Items {
			totalQuantity += item.Quantity
		}
		weightGrams := totalQuantity * 500

		serviceable, estCost, err := s.delhiverySvc.CheckServiceability(req.ShippingZIPCode, weightGrams)
		if err == nil && serviceable {
			shippingCost = estCost
			if shippingCost < 59.0 {
				shippingCost = 59.0
			}
		}
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

	orderID := "ORD_" + fmt.Sprint(time.Now().UnixNano()/1000000)

	var providerOrderID string
	var checkoutURL string
	orderStatus := "pending"

	paymentProv := strings.ToLower(os.Getenv("PAYMENT_PROVIDER"))

	if req.PaymentMethod == "offline_qr" {
		providerOrderID = "OFFLINE_QR"
		checkoutURL = "/checkout-success"
		orderStatus = "pending_payment"
	} else if paymentProv == "mock" {
		providerOrderID = "MOCK_" + orderID[4:]
		checkoutURL = "/mock-payment?orderId=" + orderID
	} else {
		keyID := os.Getenv("RAZORPAY_KEY_ID")
		keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

		if keyID != "" && keySecret != "" {
			rzpOrderID, err := createRazorpayOrder(finalTotal, orderID, keyID, keySecret)
			if err == nil && rzpOrderID != "" {
				providerOrderID = rzpOrderID
				checkoutURL = "razorpay"
			} else {
				slog.Error("Razorpay API order creation failed", "error", err)
				return nil, "", "", fmt.Errorf("failed to initiate payment gateway: %w", err)
			}
		} else {
			providerOrderID = "MOCK_" + orderID[4:]
			checkoutURL = "/mock-payment?orderId=" + orderID
		}
	}

	order := &models.Order{
		ID:                     orderID,
		CustomerEmail:          req.CustomerEmail,
		TotalAmount:            finalTotal,
		DiscountAmt:            discountAmt,
		CouponCode:             req.CouponCode,
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
		PickupLocationSnapshot: pickupLocationSnapshot,
	}

	appliedCouponCode := ""
	if discountAmt > 0 {
		appliedCouponCode = req.CouponCode
	}

	err := s.orderRepo.CreateOrderWithTransaction(order, nil, appliedCouponCode)
	if err != nil {
		return nil, "", "", err
	}

	return order, providerOrderID, checkoutURL, nil
}

func (s *orderService) VerifyPayment(req *models.OrderVerifyRequest) (*models.OrderVerifyResponse, error) {
	o, err := s.orderRepo.GetOrder(req.OrderID)
	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}

	if o.Status == "paid" || o.Status == "shipped" || o.Status == "ready_for_pickup" || o.Status == "dispatched_instant" {
		return &models.OrderVerifyResponse{
			Message:      "Payment already verified previously",
			UnlockedGift: o.UnlockedGift,
		}, nil
	}

	if req.Mock {
		// Mock payments are ONLY allowed if the order was created under a mock provider or system payment provider is mock
		paymentProv := os.Getenv("PAYMENT_PROVIDER")
		isOrderMock := strings.HasPrefix(o.RazorpayOrderID, "MOCK_")
		if !isOrderMock && paymentProv != "mock" {
			return nil, errors.New("mock payment verification is disabled for live orders")
		}
	} else {
		secret := os.Getenv("RAZORPAY_KEY_SECRET")
		if secret != "" {
			if req.RazorpaySignature == "" || req.RazorpayPaymentID == "" || req.RazorpayOrderID == "" {
				return nil, errors.New("missing Razorpay verification parameters")
			}
			data := req.RazorpayOrderID + "|" + req.RazorpayPaymentID
			h := hmac.New(sha256.New, []byte(secret))
			h.Write([]byte(data))
			generatedSig := hex.EncodeToString(h.Sum(nil))

			if generatedSig != req.RazorpaySignature {
				return nil, errors.New("invalid Razorpay payment signature")
			}
		} else if !strings.HasPrefix(o.RazorpayOrderID, "MOCK_") {
			return nil, errors.New("payment gateway configuration missing")
		}
	}

	payID := req.RazorpayPaymentID
	if payID == "" {
		payID = "PAY_" + fmt.Sprint(time.Now().Unix())
	}

	var newCoupon *models.Coupon

	// 1. Calculate Gift based on TotalAmount
	var unlockedGift, giftType, giftCode, giftExpiryDate string
	tiers, _ := s.couponSvc.GetGiftTiers()

	// Tiers should be checked to find the highest threshold met
	var highestTier *models.GiftTier
	for i := range tiers {
		if o.TotalAmount >= tiers[i].Threshold {
			if highestTier == nil || tiers[i].Threshold > highestTier.Threshold {
				highestTier = &tiers[i]
			}
		}
	}

	if highestTier != nil {
		if highestTier.RewardType == "physical" {
			unlockedGift = highestTier.PhysicalName
			giftType = "physical"
		} else if highestTier.RewardType == "coupon" {
			giftType = "coupon"
			randSuffix := fmt.Sprintf("%04d", time.Now().UnixNano()%10000)
			format := highestTier.CouponFormat
			if format == "" {
				format = "GFT-[RAND]"
			}
			giftCode = ""
			for i := 0; i < len(format); i++ {
				if i+6 <= len(format) && format[i:i+6] == "[RAND]" {
					giftCode += randSuffix
					i += 5
				} else {
					giftCode += string(format[i])
				}
			}

			unlockedGift = giftCode

			expiry := time.Now().AddDate(0, 1, 0).Format(time.RFC3339) // 1 month validity
			giftExpiryDate = expiry
			newCoupon = &models.Coupon{
				Code:       giftCode,
				Type:       highestTier.DiscountType,
				Value:      highestTier.DiscountValue,
				MinOrder:   0,
				UsageLimit: 1,
				ExpiryDate: expiry,
				IsActive:   true,
			}
		}
	}

	err = s.orderRepo.UpdateOrderStatusWithGiftTransaction(o.ID, "paid", payID, unlockedGift, newCoupon)
	if err != nil {
		return nil, err
	}

	resp := &models.OrderVerifyResponse{
		Message:                "Payment verified and order finalized successfully",
		UnlockedGift:           unlockedGift,
		GiftType:               giftType,
		GiftCode:               giftCode,
		GiftExpiryDate:         giftExpiryDate,
		TrackingNumber:         o.TrackingNumber,
		CheckoutType:           o.CheckoutType,
		FulfilmentType:         o.FulfilmentType,
		IsPreorder:             o.FulfilmentType != "" || o.IsPreorder,
		PickupLocationSnapshot: o.PickupLocationSnapshot,
		Amount:                 o.TotalAmount,
	}
	return resp, nil
}

func (s *orderService) GetOrder(orderID string) (*models.Order, error) {
	return s.orderRepo.GetOrder(orderID)
}

func (s *orderService) GetAllOrders(email string) ([]models.Order, error) {
	return s.orderRepo.GetAllOrders(email)
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
					if cancelErr := s.orderRepo.CancelPendingOrder(o.ID); cancelErr == nil {
						cleanedCount++
					}
				}
			}
		}
	}
	return cleanedCount, nil
}

func (s *orderService) CancelOrder(orderID string) error {
	return s.orderRepo.CancelPendingOrder(orderID)
}

func (s *orderService) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	return s.orderRepo.UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift)
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
