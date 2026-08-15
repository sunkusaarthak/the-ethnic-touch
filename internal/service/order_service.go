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
	VerifyPayment(req *models.OrderVerifyRequest) error
	GetOrder(orderID string) (*models.Order, error)
	GetAllOrders(email string) ([]models.Order, error)
	ConfirmPickup(orderID string) error
	CleanupAbandonedOrders(cutoff time.Duration) (int, error)
}

type orderService struct {
	orderRepo   repository.OrderRepository
	couponRepo  repository.CouponRepository
	productRepo repository.ProductRepository
}

func NewOrderService(orderRepo repository.OrderRepository, couponRepo repository.CouponRepository, productRepo repository.ProductRepository) OrderService {
	return &orderService{
		orderRepo:   orderRepo,
		couponRepo:  couponRepo,
		productRepo: productRepo,
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
		c, err := s.couponRepo.GetByCode(req.CouponCode)
		if err == nil && c.IsActive {
			if subtotal >= c.MinOrder && (c.UsageLimit == 0 || c.UsedCount < c.UsageLimit) {
				if c.Type == "fixed" {
					discountAmt = c.Value
				} else if c.Type == "percentage" {
					if c.Value == 100.0 && len(req.CouponCode) >= 15 && req.CouponCode[:15] == "SPIN-FREEKURTHI" {
						minPrice := -1.0
						for _, item := range orderItems {
							if minPrice == -1.0 || item.PriceAtQty < minPrice {
								minPrice = item.PriceAtQty
							}
						}
						if minPrice > 0 {
							discountAmt = minPrice
						} else {
							discountAmt = 0
						}
					} else if len(req.CouponCode) >= 11 && req.CouponCode[:11] == "SPIN-KURTHI" {
						minPrice := -1.0
						for _, item := range orderItems {
							if minPrice == -1.0 || item.PriceAtQty < minPrice {
								minPrice = item.PriceAtQty
							}
						}
						if minPrice > 0 {
							discountAmt = (minPrice * c.Value) / 100.0
						} else {
							discountAmt = 0
						}
					} else {
						discountAmt = (subtotal * c.Value) / 100.0
					}
				}
				if discountAmt > subtotal {
					discountAmt = subtotal
				}
			}
		}
	}

	finalTotal := subtotal - discountAmt
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

func (s *orderService) VerifyPayment(req *models.OrderVerifyRequest) error {
	o, err := s.orderRepo.GetOrder(req.OrderID)
	if err != nil {
		return fmt.Errorf("order not found: %w", err)
	}

	if !req.Mock {
		secret := os.Getenv("RAZORPAY_KEY_SECRET")
		if secret != "" {
			data := req.RazorpayOrderID + "|" + req.RazorpayPaymentID
			h := hmac.New(sha256.New, []byte(secret))
			h.Write([]byte(data))
			generatedSig := hex.EncodeToString(h.Sum(nil))

			if generatedSig != req.RazorpaySignature {
				return errors.New("invalid Razorpay payment signature")
			}
		}
	}

	payID := req.RazorpayPaymentID
	if payID == "" {
		payID = "PAY_" + fmt.Sprint(time.Now().Unix())
	}

	return s.orderRepo.UpdateOrderStatus(o.ID, "paid", payID, "", "", "")
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
	thresholdTime := time.Now().Add(-cutoff)

	for _, o := range orders {
		if o.Status == "pending" || o.Status == "pending_payment" {
			createdAt, parseErr := time.Parse(time.RFC3339, o.CreatedAt)
			if parseErr == nil && createdAt.Before(thresholdTime) {
				if cancelErr := s.orderRepo.CancelPendingOrder(o.ID); cancelErr == nil {
					cleanedCount++
				}
			}
		}
	}
	return cleanedCount, nil
}
