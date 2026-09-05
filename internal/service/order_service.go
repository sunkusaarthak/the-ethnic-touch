package service

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"net/http"
	"os"
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
	CleanupAbandonedOrders(cutoff time.Duration) (int, error)
}

type orderService struct {
	orderRepo   repository.OrderRepository
	couponSvc   CouponService
	productRepo repository.ProductRepository
	configSvc   ConfigService
	delhiverySvc DelhiveryService
}

func NewOrderService(orderRepo repository.OrderRepository, couponSvc CouponService, productRepo repository.ProductRepository, configSvc ConfigService, delhiverySvc DelhiveryService) OrderService {
	return &orderService{
		orderRepo:   orderRepo,
		couponSvc:   couponSvc,
		productRepo: productRepo,
		configSvc:   configSvc,
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
		return "", fmt.Errorf("razorpay api status %d", resp.StatusCode)
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
		}
	}

	finalTotal := subtotal - discountAmt

	cfg, _ := s.configSvc.GetCheckoutConfig()
	threshold := cfg.FreeShippingThreshold
	if threshold == 0 {
		threshold = 1449.0
	}

	var shippingCost float64
	if finalTotal < threshold && req.ShippingZIPCode != "" {
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

	orderID := "ORD_" + fmt.Sprint(time.Now().UnixNano()/1000000)

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

		if keyID != "" && keySecret != "" {
			rzpOrderID, err := createRazorpayOrder(finalTotal, orderID, keyID, keySecret)
			if err == nil && rzpOrderID != "" {
				providerOrderID = rzpOrderID
			} else {
				providerOrderID = "RZP_" + orderID[4:]
			}
		} else {
			providerOrderID = "RZP_" + orderID[4:]
		}
		checkoutURL = "razorpay"
	}

	order := &models.Order{
		ID:              orderID,
		CustomerEmail:   req.CustomerEmail,
		TotalAmount:     finalTotal,
		DiscountAmt:     discountAmt,
		CouponCode:      req.CouponCode,
		Status:          orderStatus,
		CreatedAt:       time.Now().Format(time.RFC3339),
		RazorpayOrderID: providerOrderID,
		ShippingName:    req.ShippingName,
		ShippingPhone:   req.ShippingPhone,
		ShippingAddress: req.ShippingAddress,
		ShippingCity:    req.ShippingCity,
		ShippingState:   req.ShippingState,
		ShippingZIPCode: req.ShippingZIPCode,
		CheckoutType:    req.CheckoutType,
		PaymentMethod:   req.PaymentMethod,
		Items:           orderItems,
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

	if !req.Mock {
		secret := os.Getenv("RAZORPAY_KEY_SECRET")
		if secret != "" {
			data := req.RazorpayOrderID + "|" + req.RazorpayPaymentID
			h := hmac.New(sha256.New, []byte(secret))
			h.Write([]byte(data))
			generatedSig := hex.EncodeToString(h.Sum(nil))

			if generatedSig != req.RazorpaySignature {
				return nil, errors.New("invalid Razorpay payment signature")
			}
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
		Message:        "Payment verified and order finalized successfully",
		UnlockedGift:   unlockedGift,
		GiftType:       giftType,
		GiftCode:       giftCode,
		GiftExpiryDate: giftExpiryDate,
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

func (s *orderService) UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift string) error {
	return s.orderRepo.UpdateOrderStatus(orderID, status, paymentID, tracking, shippedAt, unlockedGift)
}
