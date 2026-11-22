package service

import (
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"log"
	"net"
	"net/smtp"
	"strings"
	"time"

	"ethnictouch/internal/config"
	"ethnictouch/internal/models"
)

// EmailService defines methods for sending transactional brand emails
type EmailService interface {
	IsConfigured() bool
	VerifyConnection() error
	SendEmail(to, subject, htmlBody, textBody string) error
	SendOrderConfirmation(order *models.Order) error
	SendOrderShipped(order *models.Order, trackingNumber string) error
	SendOrderPickedUp(order *models.Order) error
	GeneratePreview(previewType string) (subject string, html string, err error)
}

type emailService struct {
	cfg *config.Config
}

// NewEmailService instantiates an EmailService
func NewEmailService(cfg *config.Config) EmailService {
	return &emailService{cfg: cfg}
}

// IsConfigured returns true if email credentials (Gmail user & app password) are present
func (s *emailService) IsConfigured() bool {
	if s.cfg == nil {
		return false
	}
	user := strings.TrimSpace(s.cfg.GmailUser)
	pass := strings.ReplaceAll(s.cfg.GmailAppPassword, " ", "")
	return user != "" && pass != ""
}

// VerifyConnection validates the SMTP handshake and authentication against Gmail or custom SMTP
func (s *emailService) VerifyConnection() error {
	if !s.IsConfigured() {
		return fmt.Errorf("email credentials not configured")
	}
	smtpUser := strings.TrimSpace(s.cfg.GmailUser)
	smtpPass := strings.ReplaceAll(s.cfg.GmailAppPassword, " ", "")
	smtpHost := s.cfg.SMTPHost
	if smtpHost == "" {
		smtpHost = "smtp.gmail.com"
	}
	smtpPort := s.cfg.SMTPPort
	if smtpPort == "" {
		smtpPort = "465"
	}

	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
	targetAddr := net.JoinHostPort(smtpHost, smtpPort)

	if smtpPort == "465" {
		conn, err := tls.DialWithDialer(&net.Dialer{Timeout: 5 * time.Second}, "tcp", targetAddr, &tls.Config{
			ServerName: smtpHost,
		})
		if err != nil {
			return fmt.Errorf("SMTP SSL dial failed on %s: %w", targetAddr, err)
		}
		defer conn.Close()

		client, err := smtp.NewClient(conn, smtpHost)
		if err != nil {
			return fmt.Errorf("SMTP client failed: %w", err)
		}
		defer client.Close()

		if err := client.Auth(auth); err != nil {
			return fmt.Errorf("SMTP authentication failed for %s: %w", smtpUser, err)
		}
		return client.Quit()
	}

	client, err := smtp.Dial(targetAddr)
	if err != nil {
		return fmt.Errorf("SMTP dial failed: %w", err)
	}
	defer client.Close()

	if err := client.StartTLS(&tls.Config{ServerName: smtpHost}); err != nil {
		return fmt.Errorf("SMTP STARTTLS failed: %w", err)
	}
	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("SMTP authentication failed for %s: %w", smtpUser, err)
	}
	return client.Quit()
}

// SendEmail delivers an HTML and plain-text multipart email via SMTP
func (s *emailService) SendEmail(to, subject, htmlBody, textBody string) error {
	to = strings.TrimSpace(to)
	if to == "" {
		return fmt.Errorf("recipient email address is empty")
	}

	fromName := "The Ethnic Touch"
	fromAddress := "orders@theethnictouch.com"
	replyTo := "theethnictouchsupport@gmail.com"

	if s.cfg != nil {
		if s.cfg.EmailFromName != "" {
			fromName = s.cfg.EmailFromName
		}
		if s.cfg.EmailFromAddress != "" {
			fromAddress = s.cfg.EmailFromAddress
		}
		if s.cfg.EmailReplyTo != "" {
			replyTo = s.cfg.EmailReplyTo
		}
	}

	// Mock / Preview Mode when credentials are not configured
	if !s.IsConfigured() {
		log.Println("--------------------------------------------------")
		log.Println("[MOCK EMAIL SIMULATION]")
		log.Printf("From:    \"%s\" <%s>\n", fromName, fromAddress)
		log.Printf("To:      %s\n", to)
		log.Printf("Subject: %s\n", subject)
		log.Println("Status:  Delivered (Mock Mode - configure GMAIL_USER & GMAIL_APP_PASSWORD for live delivery)")
		log.Println("--------------------------------------------------")
		return nil
	}

	smtpUser := strings.TrimSpace(s.cfg.GmailUser)
	smtpPass := strings.ReplaceAll(s.cfg.GmailAppPassword, " ", "")
	smtpHost := s.cfg.SMTPHost
	if smtpHost == "" {
		smtpHost = "smtp.gmail.com"
	}
	smtpPort := s.cfg.SMTPPort
	if smtpPort == "" {
		smtpPort = "465"
	}

	boundary := fmt.Sprintf("=_Boundary_%d_%s", time.Now().UnixNano(), "ET")

	// Encode subject with RFC 2047 UTF-8 Base64
	encodedSubject := fmt.Sprintf("=?UTF-8?B?%s?=", base64.StdEncoding.EncodeToString([]byte(subject)))

	// Compose MIME headers
	var headers strings.Builder
	headers.WriteString(fmt.Sprintf("From: \"%s\" <%s>\r\n", fromName, smtpUser))
	headers.WriteString(fmt.Sprintf("To: %s\r\n", to))
	headers.WriteString(fmt.Sprintf("Reply-To: %s\r\n", replyTo))
	headers.WriteString(fmt.Sprintf("Subject: %s\r\n", encodedSubject))
	headers.WriteString("MIME-Version: 1.0\r\n")
	headers.WriteString(fmt.Sprintf("Content-Type: multipart/alternative; boundary=\"%s\"\r\n", boundary))
	headers.WriteString("\r\n")

	// Text section
	var body strings.Builder
	body.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	body.WriteString("Content-Type: text/plain; charset=UTF-8\r\n")
	body.WriteString("Content-Transfer-Encoding: base64\r\n\r\n")
	body.WriteString(base64.StdEncoding.EncodeToString([]byte(textBody)))
	body.WriteString("\r\n")

	// HTML section
	body.WriteString(fmt.Sprintf("--%s\r\n", boundary))
	body.WriteString("Content-Type: text/html; charset=UTF-8\r\n")
	body.WriteString("Content-Transfer-Encoding: base64\r\n\r\n")
	body.WriteString(base64.StdEncoding.EncodeToString([]byte(htmlBody)))
	body.WriteString("\r\n")

	// End boundary
	body.WriteString(fmt.Sprintf("--%s--\r\n", boundary))

	rawMessage := []byte(headers.String() + body.String())

	// Deliver via SMTP
	auth := smtp.PlainAuth("", smtpUser, smtpPass, smtpHost)
	targetAddr := net.JoinHostPort(smtpHost, smtpPort)

	if smtpPort == "465" {
		tlsConfig := &tls.Config{
			ServerName:         smtpHost,
			InsecureSkipVerify: false,
		}

		conn, err := tls.Dial("tcp", targetAddr, tlsConfig)
		if err != nil {
			return fmt.Errorf("failed to dial SMTP SSL on %s: %w", targetAddr, err)
		}
		defer conn.Close()

		client, err := smtp.NewClient(conn, smtpHost)
		if err != nil {
			return fmt.Errorf("failed to create SMTP client: %w", err)
		}
		defer client.Close()

		if err := client.Auth(auth); err != nil {
			return fmt.Errorf("SMTP auth failed for %s: %w", smtpUser, err)
		}
		if err := client.Mail(smtpUser); err != nil {
			return fmt.Errorf("SMTP MAIL failed: %w", err)
		}
		if err := client.Rcpt(to); err != nil {
			return fmt.Errorf("SMTP RCPT failed: %w", err)
		}
		w, err := client.Data()
		if err != nil {
			return fmt.Errorf("SMTP DATA failed: %w", err)
		}
		if _, err := w.Write(rawMessage); err != nil {
			return fmt.Errorf("failed writing SMTP body: %w", err)
		}
		if err := w.Close(); err != nil {
			return fmt.Errorf("failed closing SMTP stream: %w", err)
		}
		_ = client.Quit()
	} else {
		client, err := smtp.Dial(targetAddr)
		if err != nil {
			return fmt.Errorf("failed to dial SMTP on %s: %w", targetAddr, err)
		}
		defer client.Close()

		tlsConfig := &tls.Config{ServerName: smtpHost}
		if err := client.StartTLS(tlsConfig); err != nil {
			return fmt.Errorf("failed to start TLS on %s: %w", targetAddr, err)
		}

		if err := client.Auth(auth); err != nil {
			return fmt.Errorf("SMTP auth failed for %s: %w", smtpUser, err)
		}
		if err := client.Mail(smtpUser); err != nil {
			return fmt.Errorf("SMTP MAIL failed: %w", err)
		}
		if err := client.Rcpt(to); err != nil {
			return fmt.Errorf("SMTP RCPT failed: %w", err)
		}
		w, err := client.Data()
		if err != nil {
			return fmt.Errorf("SMTP DATA failed: %w", err)
		}
		if _, err := w.Write(rawMessage); err != nil {
			return fmt.Errorf("failed writing SMTP body: %w", err)
		}
		if err := w.Close(); err != nil {
			return fmt.Errorf("failed closing SMTP stream: %w", err)
		}
		_ = client.Quit()
	}

	log.Printf("[Email Sent] Successfully delivered email to %s | Subject: %s", to, subject)
	return nil
}

// Helper: determine if an order is for store pickup
func isStorePickup(order *models.Order) bool {
	if order == nil {
		return false
	}
	ft := strings.ToUpper(strings.TrimSpace(order.FulfilmentType))
	if ft == "PREORDER_STORE_PICKUP" || strings.Contains(ft, "STORE_PICKUP") || strings.Contains(ft, "PICKUP") {
		return true
	}
	ct := strings.ToLower(strings.TrimSpace(order.CheckoutType))
	if ct == "pickup" || ct == "store_pickup" || ct == "in_store" || ct == "instore" {
		return true
	}
	pm := strings.ToLower(strings.TrimSpace(order.PaymentMethod))
	if pm == "offline_qr" {
		return true
	}
	if strings.EqualFold(order.TrackingNumber, "STORE-PICKUP") {
		return true
	}
	if order.FulfilmentType == models.FulfilmentTypePreorderHomeDelivery || ct == "delivery" || ct == "hyderabad_instant" {
		return false
	}
	addr := strings.ToLower(order.ShippingAddress)
	name := strings.ToLower(order.ShippingName)
	if strings.Contains(addr, "pickup") || strings.Contains(addr, "store") || strings.Contains(addr, "khajaguda") || strings.Contains(addr, "lake") || strings.Contains(addr, "financial district") || strings.Contains(name, "store pickup") || strings.Contains(name, "pickup customer") {
		return true
	}
	if order.ShippingPhone == "0000000000" && (strings.Contains(addr, "hyderabad") || strings.Contains(addr, "telangana")) {
		return true
	}
	return false
}

// Helper: determine if an order is fully paid
func isOrderPaid(order *models.Order) bool {
	if order == nil {
		return false
	}
	st := strings.ToLower(strings.TrimSpace(order.Status))
	if st == "paid" || st == "confirmed" || st == "completed" {
		return true
	}
	pm := strings.ToLower(strings.TrimSpace(order.PaymentMethod))
	if pm == "offline_qr" {
		return false
	}
	return false
}

const defaultProductImage = "https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/email-assets/product_placeholder.png"

// Helper: resolve product image URL to absolute URL
func resolveProductImageURL(rawURL string) string {
	rawURL = strings.TrimSpace(rawURL)
	if rawURL == "" || strings.EqualFold(rawURL, "test") {
		return defaultProductImage
	}
	if strings.HasPrefix(rawURL, "http://") || strings.HasPrefix(rawURL, "https://") {
		return rawURL
	}
	clean := strings.TrimPrefix(rawURL, "./")
	clean = strings.TrimPrefix(clean, "/")
	if strings.HasPrefix(clean, "images/") {
		return "https://www.theethnictouch.com/" + clean
	}
	if strings.HasPrefix(clean, "products/") {
		return "https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/" + clean
	}
	if strings.Contains(clean, ".png") || strings.Contains(clean, ".jpg") || strings.Contains(clean, ".jpeg") || strings.Contains(clean, ".webp") {
		return "https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/products/" + clean
	}
	return defaultProductImage
}

// SendOrderConfirmation handles sending confirmation emails based on context:
// 1. Prepaid Store Pickup (pickup + paid)
// 2. Unpaid Store Pickup (pickup + offline_qr / pending)
// 3. Delivery Order (standard pan-india or hyderabad instant)
func (s *emailService) SendOrderConfirmation(order *models.Order) error {
	if order == nil || strings.TrimSpace(order.CustomerEmail) == "" {
		return fmt.Errorf("cannot send order confirmation: missing order or customer email")
	}

	isPickup := isStorePickup(order)
	isPaid := isOrderPaid(order)

	var subject string
	if isPickup {
		if order.IsPreorder {
			subject = fmt.Sprintf("Preorder Confirmed: #%s | Hyderabad Store Pickup", order.ID)
		} else if isPaid {
			subject = fmt.Sprintf("Order Confirmed: #%s | Prepaid Store Pickup at Hyderabad Store", order.ID)
		} else {
			subject = fmt.Sprintf("Order Reserved: #%s | Pay on Pickup at Hyderabad Store", order.ID)
		}
	} else {
		if order.IsPreorder {
			subject = fmt.Sprintf("Preorder Confirmed: #%s | Preparing Artisan Production | The Ethnic Touch", order.ID)
		} else {
			subject = fmt.Sprintf("Order Confirmed: #%s | Preparing for Dispatch | The Ethnic Touch", order.ID)
		}
	}

	html := renderOrderConfirmationHTML(order)
	text := renderOrderConfirmationText(order)

	return s.SendEmail(order.CustomerEmail, subject, html, text)
}

// SendOrderShipped sends an email notifying the customer their order has been dispatched
func (s *emailService) SendOrderShipped(order *models.Order, trackingNumber string) error {
	if order == nil || strings.TrimSpace(order.CustomerEmail) == "" {
		return fmt.Errorf("cannot send shipped email: missing order or customer email")
	}

	if trackingNumber == "" {
		trackingNumber = order.TrackingNumber
	}
	if trackingNumber == "" {
		trackingNumber = "DELHIVERY_EXPRESS"
	}

	subject := fmt.Sprintf("Order Dispatched: #%s | The Ethnic Touch", order.ID)
	html := renderOrderShippedHTML(order, trackingNumber)
	text := renderOrderShippedText(order, trackingNumber)

	return s.SendEmail(order.CustomerEmail, subject, html, text)
}

// SendOrderPickedUp sends a heartfelt thank-you and care guide once store pickup is completed
func (s *emailService) SendOrderPickedUp(order *models.Order) error {
	if order == nil || strings.TrimSpace(order.CustomerEmail) == "" {
		return fmt.Errorf("cannot send picked up email: missing order or customer email")
	}

	subject := fmt.Sprintf("Order Picked Up: #%s | Thank You for Visiting The Ethnic Touch", order.ID)
	html := renderOrderPickedUpHTML(order)
	text := renderOrderPickedUpText(order)

	return s.SendEmail(order.CustomerEmail, subject, html, text)
}


// GeneratePreview creates realistic sample data and renders email templates for dev preview
func (s *emailService) GeneratePreview(previewType string) (string, string, error) {
	norm := strings.ToLower(strings.TrimSpace(previewType))

	sampleItems := []models.OrderItem{
		{
			ProductID:   "p_indigo_1",
			ProductName: "Indigo Blue Floral Pure Cotton Kurti",
			Quantity:    1,
			PriceAtQty:  899.0,
			Size:        "M",
			ImageURL:    "https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/products/Navy_Blue_1.png",
		},
		{
			ProductID:   "p_peach_2",
			ProductName: "Pastel Peach Floral Straight Cotton Kurti",
			Quantity:    1,
			PriceAtQty:  699.0,
			Size:        "L",
			ImageURL:    "", // Tests elegant gold lotus fallback
		},
	}

	switch norm {
	case "prepaid_pickup", "prepaid-pickup", "pickup_paid", "1":
		order := &models.Order{
			ID:            "ORD_1795281014822",
			CustomerEmail: "priya.sharma@gmail.com",
			ShippingName:  "Store Pickup Customer", // tests smart email prefix greeting
			TotalAmount:   1498.0,
			DiscountAmt:   100.0,
			CouponCode:    "FESTIVE100",
			UnlockedGift:  "Complimentary Handcrafted Potli Bag",
			Status:        "paid",
			CheckoutType:  "pickup",
			PaymentMethod: "online",
			Items:         sampleItems,
		}
		subject := fmt.Sprintf("Order Confirmed: #%s | Prepaid Store Pickup at Hyderabad Store", order.ID)
		return subject, renderOrderConfirmationHTML(order), nil

	case "unpaid_pickup", "unpaid-pickup", "offline_qr", "reserve", "2":
		order := &models.Order{
			ID:            "ORD_1795281099231",
			CustomerEmail: "ananya.patel@gmail.com",
			ShippingName:  "Store Pickup Customer",
			TotalAmount:   1598.0,
			DiscountAmt:   0,
			Status:        "pending_payment",
			CheckoutType:  "pickup",
			PaymentMethod: "offline_qr",
			Items:         sampleItems,
		}
		subject := fmt.Sprintf("Order Reserved: #%s | Pay on Pickup at Hyderabad Store", order.ID)
		return subject, renderOrderConfirmationHTML(order), nil

	case "delivery", "shipping", "3":
		order := &models.Order{
			ID:              "ORD_1795281144211",
			CustomerEmail:   "deepa.kapoor@gmail.com",
			ShippingName:    "Deepa Kapoor",
			ShippingAddress: "Flat 402, Lotus Towers, Banjara Hills Road No 12",
			ShippingCity:    "Hyderabad",
			ShippingState:   "Telangana",
			ShippingZIPCode: "500034",
			ShippingPhone:   "9876543210",
			TotalAmount:     1498.0,
			DiscountAmt:     100.0,
			CouponCode:      "WELCOME100",
			Status:          "paid",
			CheckoutType:    "delivery",
			PaymentMethod:   "online",
			Items:           sampleItems,
		}
		subject := fmt.Sprintf("Order Confirmed: #%s | Preparing for Dispatch | The Ethnic Touch", order.ID)
		return subject, renderOrderConfirmationHTML(order), nil

	case "shipped", "dispatched", "4":
		order := &models.Order{
			ID:              "ORD_1795281144211",
			CustomerEmail:   "deepa.kapoor@gmail.com",
			ShippingName:    "Deepa Kapoor",
			ShippingAddress: "Flat 402, Lotus Towers, Banjara Hills Road No 12",
			ShippingCity:    "Hyderabad",
			ShippingState:   "Telangana",
			ShippingZIPCode: "500034",
			ShippingPhone:   "9876543210",
			TotalAmount:     1498.0,
			Items:           sampleItems,
		}
		subject := fmt.Sprintf("Order Dispatched: #%s | The Ethnic Touch", order.ID)
		return subject, renderOrderShippedHTML(order, "DELHIVERY_99281746201"), nil

	case "picked_up", "completed", "5":
		order := &models.Order{
			ID:            "ORD_1795281014822",
			CustomerEmail: "priya.sharma@gmail.com",
			ShippingName:  "Priya Sharma",
			TotalAmount:   1498.0,
			Items:         sampleItems,
		}
		subject := fmt.Sprintf("Order Picked Up: #%s | Thank You for Visiting The Ethnic Touch", order.ID)
		return subject, renderOrderPickedUpHTML(order), nil

	default:
		return "", "", fmt.Errorf("unknown preview type '%s'. Valid options: prepaid_pickup, unpaid_pickup, delivery, shipped, picked_up", previewType)
	}
}


// -------------------------------------------------------------------------
// TEMPLATE BUILDERS (Haute Couture • 95% Mobile First • No Emojis • Vector SVGs)
// -------------------------------------------------------------------------

const (
	footerBrandLogoHTML = `<a href="https://www.theethnictouch.com" style="text-decoration:none; display:inline-block; margin-bottom:8px;">
		<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto; border-collapse:collapse;">
			<tr>
				<td style="vertical-align:middle; padding-right:10px;">
					<img src="https://www.theethnictouch.com/navbar-logo.png" alt="The Ethnic Touch" width="38" height="29" style="display:block; max-height:29px; width:auto; border:0;" />
				</td>
				<td style="border-left:1.5px solid #D4A373; height:22px; padding-left:10px; vertical-align:middle;">
					<span style="font-family:'Playfair Display',Georgia,serif; font-size:18px; font-style:italic; font-weight:600; color:#1E1A17; letter-spacing:0.3px; display:block; line-height:1;">The Ethnic Touch</span>
				</td>
			</tr>
		</table>
	</a>`
	iconBoxSVG     = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:text-bottom; margin-right:4px;"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`
	iconPinSVG     = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:text-bottom; margin-right:4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`
	iconClockSVG   = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:text-bottom; margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
	iconTruckSVG   = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:text-bottom; margin-right:4px;"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`
	iconShieldSVG  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:text-bottom; margin-right:4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
	iconPhoneSVG   = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:3px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`
	iconMailSVG    = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:3px;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
	iconCheckmarkSVG = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin: 0 auto;"><polyline points="20 6 9 17 4 12"></polyline></svg>`
	iconPendingClockSVG = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8C5835" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block; margin: 0 auto;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
)

// Returns customer greeting name with graceful fallbacks
func getCustomerDisplayName(order *models.Order) string {
	if order == nil {
		return "Valued Patron"
	}
	name := strings.TrimSpace(order.ShippingName)
	if name != "" && !strings.EqualFold(name, "Store Pickup Customer") && !strings.Contains(strings.ToLower(name), "store pickup") {
		return name
	}
	// Extract and clean name from email prefix
	parts := strings.Split(order.CustomerEmail, "@")
	if len(parts) > 0 && strings.TrimSpace(parts[0]) != "" {
		cleaned := strings.ReplaceAll(parts[0], ".", " ")
		cleaned = strings.ReplaceAll(cleaned, "_", " ")
		cleaned = strings.ReplaceAll(cleaned, "-", " ")
		words := strings.Fields(cleaned)
		var titleWords []string
		for _, w := range words {
			if len(w) > 0 {
				titleWords = append(titleWords, strings.ToUpper(w[:1])+strings.ToLower(w[1:]))
			}
		}
		if len(titleWords) > 0 {
			return strings.Join(titleWords, " ")
		}
	}
	return "Valued Patron"
}

func formatCurrency(amt float64) string {
	return fmt.Sprintf("₹%.2f", amt)
}

// 95% Mobile Optimized Product Items Table
func renderOrderItemsTable(items []models.OrderItem) string {
	var sb strings.Builder
	sb.WriteString(`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 12px; width: 100%;">`)
	for _, it := range items {
		name := it.ProductName
		if name == "" || strings.EqualFold(name, "test") {
			name = "Jaipur Pure Cotton Kurti"
		}
		itemTotal := it.PriceAtQty * float64(it.Quantity)
		sizeLabel := ""
		if it.Size != "" {
			sizeLabel = fmt.Sprintf(`<span style="display:inline-block; font-size:10px; font-weight:700; color:#78451D; background:#FAF3EA; border:1px solid #D4A373; border-radius:3px; padding:2px 6px; margin-right:4px;">Size: %s</span>`, it.Size)
		}

		prodLink := "https://www.theethnictouch.com/shop"
		if it.ProductID != "" && !strings.EqualFold(it.ProductID, "test") {
			prodLink = fmt.Sprintf("https://www.theethnictouch.com/product/%s", it.ProductID)
		}

		resolvedImg := resolveProductImageURL(it.ImageURL)
		imgTag := fmt.Sprintf(`<a href="%s" target="_blank" style="text-decoration:none; display:block;"><img src="%s" alt="%s" width="56" height="70" style="display:block; width:56px; height:70px; object-fit:cover; border-radius:6px; border:1px solid #D4A373; background:#FAF6F0; box-shadow:0 2px 6px rgba(140,88,53,0.1);" /></a>`, prodLink, resolvedImg, name)

		sb.WriteString(fmt.Sprintf(`
		<tr>
			<td style="padding: 12px 10px 12px 0; border-bottom: 1px solid #F0EAE1; width: 56px; vertical-align: top;">
				%s
			</td>
			<td style="padding: 12px 6px; border-bottom: 1px solid #F0EAE1; vertical-align: top;">
				<a href="%s" target="_blank" style="text-decoration:none; color:#1E1A17; display:inline-block;">
					<div style="font-family: 'Inter', sans-serif; font-size: 13.5px; font-weight: 700; color: #1E1A17; line-height: 1.35;">%s</div>
				</a>
				<div style="margin-top: 5px;">
					%s
					<span style="display:inline-block; font-size:10px; font-weight:600; color:#2E6B48; background:#F0F7F2; border:1px solid #A9D1B7; border-radius:3px; padding:2px 6px;">100%% Pure Cotton</span>
				</div>
				<div style="font-size: 12px; color: #787068; margin-top: 5px;">Qty: <strong>%d</strong> &bull; %s each</div>
			</td>
			<td style="padding: 12px 0; border-bottom: 1px solid #F0EAE1; vertical-align: top; text-align: right; width: 75px; white-space: nowrap; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #1E1A17;">
				%s
			</td>
		</tr>`, imgTag, prodLink, name, sizeLabel, it.Quantity, formatCurrency(it.PriceAtQty), formatCurrency(itemTotal)))
	}
	sb.WriteString(`</table>`)
	return sb.String()
}

func renderOrderConfirmationHTML(order *models.Order) string {
	name := getCustomerDisplayName(order)
	isPickup := isStorePickup(order)
	isPaid := isOrderPaid(order)

	// Status badge, headline, and guidance depending on context
	var badgeHTML string
	var heroIconHTML string
	var headlineText string
	var contextIntroText string
	var scannerPassHTML string
	var fulfillmentCardHTML string
	var receiptRowsHTML string

	if isPickup {
		if isPaid {
			// CONTEXT 1: PREPAID STORE PICKUP
			badgeHTML = `<span style="background: linear-gradient(135deg, #EFF8F2 0%, #E0F0E5 100%); color: #1B5832; border: 1.5px solid #75B58C; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 25px; display: inline-block;">PREPAID STORE PICKUP &bull; FULLY PAID</span>`
			heroIconHTML = `<img src="https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/email-assets/check_circle_green.png" alt="Order Confirmed" width="58" height="58" style="display: block; margin: 0 auto 14px auto; width: 58px; height: 58px; border: 0;" />`
			headlineText = "Your In-Store Collection is Confirmed"
			contextIntroText = fmt.Sprintf("Dear %s, thank you for choosing luxury Jaipuri craftsmanship. Your store collection checkout is complete and fully paid. Our store team is preparing and carefully packing your ensembles so they are ready for collection.", name)

			if order.IsPreorder {
				badgeHTML = `<span style="background: linear-gradient(135deg, #EFF8F2 0%, #E0F0E5 100%); color: #1B5832; border: 1.5px solid #75B58C; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 25px; display: inline-block;">PREORDER CONFIRMED &bull; STORE COLLECTION</span>`
				headlineText = "Your Preorder is Confirmed for Store Collection"
				contextIntroText = fmt.Sprintf("Dear %s, thank you for pre-ordering your handcrafted Jaipuri ensembles. Your preorder is confirmed and fully paid. Once our artisans complete crafting and inspection, you will receive an alert to collect your garments at our Khajaguda store.", name)
			}

			scannerPassHTML = fmt.Sprintf(`
			<!-- Store Verification Pass (Prepaid) -->
			<div style="background: #FAF9F6; border: 1.5px solid #D4A373; border-radius: 12px; padding: 18px 14px; text-align: center; margin: 18px 0; box-shadow: 0 4px 15px rgba(212,163,115,0.08);">
				<div style="display: inline-block; background: #FAF4EE; border: 1.5px dashed #D4A373; border-radius: 20px; padding: 4px 14px; margin-bottom: 12px;">
					<span style="font-size: 10.5px; font-weight: 700; color: #8F5E36; letter-spacing: 0.8px; text-transform: uppercase;">ORDER REFERENCE:</span>
					<strong style="font-size: 13px; font-family: monospace; color: #1E1A17; margin-left: 4px;">#%s</strong>
				</div>
				<div style="font-size: 10.5px; font-weight: 700; color: #8F5E36; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;">Store Verification Scanner Pass</div>
				<div style="background: #FFFFFF; border: 1px solid #E6E4E0; border-radius: 8px; padding: 8px; display: inline-block; margin-bottom: 10px;">
					<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=1e1a17&data=https%%3A%%2F%%2Fwww.theethnictouch.com%%2Fadmin%%2Findex.html%%23pickup-scanner%%3ForderId%%3D%s" width="140" height="140" alt="Store Scanner Pass" style="display: block; margin: 0 auto; border: 0;" />
				</div>
				<div style="font-size: 12px; color: #5C5854; line-height: 1.5; max-width: 440px; margin: 0 auto;">
					<strong>Order Fully Paid.</strong> Keep this pass or your Order Reference handy for instant scanning at the retail checkout counter.
				</div>
			</div>`, order.ID, order.ID)
		} else {
			// CONTEXT 2: UNPAID STORE PICKUP (OFFLINE QR / PAY AT COUNTER)
			badgeHTML = `<span style="background: linear-gradient(135deg, #FAF3ED 0%, #F5ECE0 100%); color: #78451D; border: 1.5px solid #D4A373; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 25px; display: inline-block;">STORE PICKUP RESERVED &bull; PAY AT STORE</span>`
			heroIconHTML = `<img src="https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/email-assets/pending_clock_amber.png" alt="Order Reserved" width="58" height="58" style="display: block; margin: 0 auto 14px auto; width: 58px; height: 58px; border: 0;" />`
			headlineText = "Your Ensembles are Reserved at Our Hyderabad Store"
			contextIntroText = fmt.Sprintf("Dear %s, your handcrafted Jaipuri ensembles have been reserved and set aside for you at our Khajaguda store. Please present your Order Reference or QR Pass at our store counter when collecting your garments to complete your payment.", name)

			scannerPassHTML = fmt.Sprintf(`
			<!-- Store Verification & Payment Pass (Unpaid) -->
			<div style="background: #FAF9F6; border: 1.5px solid #D4A373; border-radius: 12px; padding: 18px 14px; text-align: center; margin: 18px 0; box-shadow: 0 4px 15px rgba(212,163,115,0.08);">
				<div style="display: inline-block; background: #FAF4EE; border: 1.5px dashed #D4A373; border-radius: 20px; padding: 4px 14px; margin-bottom: 8px;">
					<span style="font-size: 10.5px; font-weight: 700; color: #8F5E36; letter-spacing: 0.8px; text-transform: uppercase;">ORDER REFERENCE:</span>
					<strong style="font-size: 13px; font-family: monospace; color: #1E1A17; margin-left: 4px;">#%s</strong>
				</div>
				<div style="font-size: 14.5px; font-weight: 700; color: #8C5835; margin-bottom: 10px;">Payment Due on Collection: %s</div>
				<div style="background: #FFFFFF; border: 1px solid #E6E4E0; border-radius: 8px; padding: 8px; display: inline-block; margin-bottom: 10px;">
					<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=1e1a17&data=https%%3A%%2F%%2Fwww.theethnictouch.com%%2Fadmin%%2Findex.html%%23pickup-scanner%%3ForderId%%3D%s" width="140" height="140" alt="Store Scanner Pass" style="display: block; margin: 0 auto; border: 0;" />
				</div>
				<div style="font-size: 12px; color: #5C5854; line-height: 1.5; max-width: 440px; margin: 0 auto;">
					Please present this pass at the counter to finalize payment of <strong>%s</strong> (UPI, Card, or Cash accepted) and collect your bespoke kurti garments.
				</div>
			</div>`, order.ID, formatCurrency(order.TotalAmount), order.ID, formatCurrency(order.TotalAmount))
		}

		// Store Pickup Suite Details (No delivery address or 000000 phone)
		fulfillmentCardHTML = fmt.Sprintf(`
		<!-- Store Collection Point Card -->
		<div style="background: #FDFBF7; border: 1.5px solid #E6D8C5; border-radius: 10px; padding: 18px 16px; margin-bottom: 22px;">
			<div style="font-size: 11px; font-weight: 700; color: #78451D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
				%s Store Collection Point
			</div>
			<div style="font-size: 14.5px; font-weight: 700; color: #1E1A17; margin-bottom: 4px;">The Ethnic Touch Store</div>
			<div style="font-size: 13px; color: #5C554E; line-height: 1.6;">
				Near Khajaguda Lake, Financial District, Gachibowli, Hyderabad 500075<br/>
				%s <strong>Hours:</strong> Open Daily 10:30 AM – 9:00 PM<br/>
				%s <strong>Phone:</strong> +91 7674855289
			</div>
			<div style="margin-top: 14px; text-align: left;">
				<a href="https://share.google/eSxLvWitpLTqdQkn3" style="background: linear-gradient(135deg, #8C5835 0%%, #6E3F21 100%%); color: #FFFFFF; text-decoration: none; font-size: 12.5px; font-weight: 700; padding: 10px 20px; border-radius: 25px; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 3px 10px rgba(140,88,53,0.25);">
					Get Directions on Google Maps &rarr;
				</a>
			</div>
		</div>`, iconPinSVG, iconClockSVG, iconPhoneSVG)

		// Price receipt for store collection (no delivery line)
		receiptRowsHTML = fmt.Sprintf(`
		<tr>
			<td style="padding: 7px 0; font-size: 13px; color: #787068;">In-Store Pickup &amp; Collection:</td>
			<td style="padding: 7px 0; font-size: 13px; font-weight: 700; color: #2E6B48; text-align: right;">Complimentary</td>
		</tr>`)
	} else {
		// CONTEXT 3: DELIVERY ORDER
		badgeHTML = `<span style="background: linear-gradient(135deg, #FCF8F2 0%, #F5EADB 100%); color: #73431A; border: 1.5px solid #C99E5F; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 25px; display: inline-block;">ORDER CONFIRMED &bull; PREPARING FOR DISPATCH</span>`
		heroIconHTML = `<img src="https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/email-assets/check_circle_green.png" alt="Order Confirmed" width="58" height="58" style="display: block; margin: 0 auto 14px auto; width: 58px; height: 58px; border: 0;" />`
		headlineText = "Your Handcrafted Ensembles are Confirmed"
		contextIntroText = fmt.Sprintf("Dear %s, thank you for choosing The Ethnic Touch. Your order has been confirmed. Our team is carefully inspecting, steaming, and packaging your Jaipuri ensembles for swift dispatch to your doorstep.", name)

		if order.IsPreorder {
			badgeHTML = `<span style="background: linear-gradient(135deg, #FCF8F2 0%, #F5EADB 100%); color: #73431A; border: 1.5px solid #C99E5F; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 25px; display: inline-block;">PREORDER CONFIRMED &bull; CRAFTING IN PROGRESS</span>`
			headlineText = "Your Handcrafted Preorder is Confirmed"
			contextIntroText = fmt.Sprintf("Dear %s, thank you for pre-ordering. Your bespoke ensembles are now queued with our master artisans in Jaipur. We will notify you with Delhivery live tracking as soon as your order ships.", name)
		}

		shippingAddress := fmt.Sprintf("%s, %s, %s - %s", order.ShippingAddress, order.ShippingCity, order.ShippingState, order.ShippingZIPCode)
		phoneDisplay := ""
		if order.ShippingPhone != "" && order.ShippingPhone != "0000000000" {
			phoneDisplay = fmt.Sprintf("<br/>%s <strong>Phone:</strong> %s", iconPhoneSVG, order.ShippingPhone)
		}

		fulfillmentCardHTML = fmt.Sprintf(`
		<!-- Delivery Destination Card -->
		<div style="background: #FDFBF7; border: 1.5px solid #E6D8C5; border-radius: 10px; padding: 18px 16px; margin-bottom: 22px;">
			<div style="font-size: 11px; font-weight: 700; color: #78451D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
				%s Delivery Destination
			</div>
			<div style="font-size: 14.5px; font-weight: 700; color: #1E1A17; margin-bottom: 4px;">%s</div>
			<div style="font-size: 13px; color: #5C554E; line-height: 1.6;">
				%s%s
			</div>
			<div style="margin-top: 12px; padding: 10px 12px; background: #F0F7F2; border-left: 3px solid #3B8A5A; border-radius: 4px; font-size: 12px; color: #1B5832; line-height: 1.5;">
				<strong>Express Dispatch Promise:</strong> Orders placed before 1:30 PM IST dispatch today via Delhivery Express with live tracking updates.
			</div>
		</div>`, iconPinSVG, order.ShippingName, shippingAddress, phoneDisplay)

		receiptRowsHTML = fmt.Sprintf(`
		<tr>
			<td style="padding: 7px 0; font-size: 13px; color: #787068;">Insured Express Shipping:</td>
			<td style="padding: 7px 0; font-size: 13px; font-weight: 700; color: #2E6B48; text-align: right;">FREE &bull; Pan-India</td>
		</tr>`)
	}

	// Discount & Coupon Row
	discountRow := ""
	if order.DiscountAmt > 0 {
		codeText := ""
		if order.CouponCode != "" {
			codeText = fmt.Sprintf(` (%s)`, order.CouponCode)
		}
		discountRow = fmt.Sprintf(`
		<tr>
			<td style="padding: 7px 0; font-size: 13px; color: #8C5835; font-weight: 600;">Voucher Discount%s:</td>
			<td style="padding: 7px 0; font-size: 13px; font-weight: 700; color: #8C5835; text-align: right;">- %s</td>
		</tr>`, codeText, formatCurrency(order.DiscountAmt))
	}

	// Unlocked Gift Row
	unlockedGiftRow := ""
	if order.UnlockedGift != "" {
		unlockedGiftRow = fmt.Sprintf(`
		<tr>
			<td style="padding: 7px 0; font-size: 13px; color: #78451D; font-weight: 600;">Complimentary Gift Unlocked:</td>
			<td style="padding: 7px 0; font-size: 13px; font-weight: 700; color: #78451D; text-align: right;">%s (FREE)</td>
		</tr>`, order.UnlockedGift)
	}

	itemsHTML := renderOrderItemsTable(order.Items)
	subtotalAmt := order.TotalAmount + order.DiscountAmt

	// Total label depending on paid vs unpaid
	totalLabel := "Total Amount Paid:"
	if isPickup && !isPaid {
		totalLabel = "Total Due on Collection:"
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
	<meta name="x-apple-disable-message-reformatting">
	<title>Order Confirmation - The Ethnic Touch</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet">
	<style>
		@media only screen and (max-width: 600px) {
			.email-container { width: 100%% !important; max-width: 100%% !important; border-radius: 0 !important; }
			.email-body { padding: 12px 6px !important; }
			.header-cell { padding: 22px 14px 18px !important; }
			.content-cell { padding: 20px 14px !important; }
			.footer-cell { padding: 20px 14px !important; }
		}
	</style>
</head>
<body class="email-body" style="margin: 0; padding: 24px 8px; background-color: #FAF8F5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E1A17; -webkit-font-smoothing: antialiased;">
	<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1.5px solid #D4AF37; box-shadow: 0 8px 30px rgba(140, 88, 53, 0.1);">
		<!-- Top Luxury Stripe -->
		<tr>
			<td style="height: 5px; background: linear-gradient(90deg, #8C5835 0%%, #D4A373 50%%, #8C5835 100%%);"></td>
		</tr>

		<!-- Header with Brand Logo & Typography -->
		<tr>
			<td class="header-cell" style="padding: 28px 20px 22px 20px; background: linear-gradient(180deg, #FDFCF9 0%%, #F8F3EC 100%%); border-bottom: 2px solid #D4A373; text-align: center;">
				<a href="https://www.theethnictouch.com" style="text-decoration: none; display: inline-block;">
					<img src="https://www.theethnictouch.com/navbar-logo.png" alt="The Ethnic Touch Logo" width="68" height="52" style="display: block; margin: 0 auto 8px auto; max-height: 52px; width: auto; object-fit: contain; border: 0;" />
				</a>
				<div style="font-family: 'Playfair Display', Georgia, serif; font-size: 23px; font-weight: 600; font-style: italic; letter-spacing: 0.5px; color: #1E1A17;">
					The Ethnic Touch
				</div>
				<div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #9B7850; text-transform: uppercase; margin-top: 5px;">
					✦ Authentic Jaipur Craftsmanship &bull; Hyderabad Store ✦
				</div>
			</td>
		</tr>

		<!-- Main Content -->
		<tr>
			<td class="content-cell" style="padding: 26px 20px;">
				<!-- Celebration / Status Icon -->
				%s

				<!-- Status Badge -->
				<div style="text-align: center; margin-bottom: 14px;">
					%s
				</div>

				<h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 21px; font-weight: 600; color: #1E1A17; margin: 0 0 8px 0; text-align: center; line-height: 1.3;">
					%s
				</h1>
				<div style="text-align: center; color: #C99E5F; font-size: 11px; margin-bottom: 16px; letter-spacing: 5px;">❖ ── ✦ ── ❖</div>

				<p style="font-size: 13.5px; line-height: 1.6; color: #5C554E; margin: 0 0 18px 0; text-align: center;">
					%s
				</p>

				<!-- Scanner Pass (Store Pickup Only) -->
				%s

				<!-- 4-Tile Metadata Bento Box -->
				<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background: #FDFBF7; border: 1.5px solid #E6D8C5; border-radius: 10px; margin-bottom: 22px; border-collapse: separate; border-spacing: 0; overflow: hidden; width: 100%%;">
					<tr>
						<td style="padding: 12px 14px; border-right: 1px solid #E6D8C5; border-bottom: 1px solid #E6D8C5; width: 50%%; vertical-align: top;">
							<div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Order Reference</div>
							<div style="font-size: 13.5px; font-weight: 700; color: #1E1A17; margin-top: 3px; font-family: monospace;">#%s</div>
						</td>
						<td style="padding: 12px 14px; border-bottom: 1px solid #E6D8C5; width: 50%%; vertical-align: top;">
							<div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Payment Method</div>
							<div style="font-size: 13.5px; font-weight: 700; color: #1E1A17; margin-top: 3px;">%s</div>
						</td>
					</tr>
					<tr>
						<td style="padding: 12px 14px; border-right: 1px solid #E6D8C5; width: 50%%; vertical-align: top;">
							<div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Fulfillment</div>
							<div style="font-size: 13px; font-weight: 600; color: #1E1A17; margin-top: 3px;">%s</div>
						</td>
						<td style="padding: 12px 14px; width: 50%%; vertical-align: top;">
							<div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Artisan Heritage</div>
							<div style="font-size: 13px; font-weight: 600; color: #78451D; margin-top: 3px;">Authentic Jaipur</div>
						</td>
					</tr>
				</table>

				<!-- Selected Ensembles Table -->
				<div style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; color: #1E1A17; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1.5px solid #D4A373; padding-bottom: 6px;">
					%s Your Selected Ensembles
				</div>
				%s

				<!-- Royal Receipt Breakdown -->
				<div style="background: #FDFBF8; border: 1.5px solid #E4D5C2; border-radius: 10px; padding: 16px 18px; margin: 20px 0;">
					<table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
						<tr>
							<td style="padding: 6px 0; font-size: 13px; color: #787068;">Garments Subtotal:</td>
							<td style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #1E1A17; text-align: right;">%s</td>
						</tr>
						%s
						%s
						%s
						<tr>
							<td colspan="2" style="padding: 8px 0;">
								<div style="border-top: 1.5px dashed #D4A373;"></div>
							</td>
						</tr>
						<tr>
							<td style="padding: 6px 0; font-size: 15px; font-weight: 700; color: #1E1A17;">%s</td>
							<td style="padding: 6px 0; font-size: 18px; font-weight: 700; color: #8C5835; text-align: right;">%s</td>
						</tr>
					</table>
				</div>

				<!-- Fulfillment / Destination Details -->
				%s

				<!-- Artisan Pure Cotton Garment Care Box -->
				<div style="background: #FAF7F2; border: 1.5px dashed #D4A373; border-radius: 10px; padding: 16px; margin-top: 20px;">
					<div style="font-size: 11.5px; font-weight: 700; color: #78451D; text-transform: uppercase; letter-spacing: 0.8px;">
						%s Pure Cotton &amp; Dye Care Guide
					</div>
					<div style="font-size: 12.5px; color: #5C554E; line-height: 1.6; margin-top: 7px;">
						&bull; <strong>Gentle Cold Hand Wash:</strong> Protects vegetable &amp; mineral dyes using mild liquid soap.<br/>
						&bull; <strong>Dry Inside-Out in Shade:</strong> Keeps traditional natural colors vivid and fresh.<br/>
						&bull; <strong>Medium Reverse Iron:</strong> Retains crisp 100%% breathable cotton drape.
					</div>
				</div>

				<!-- VIP Concierge -->
				<div style="margin-top: 24px; text-align: center; border-top: 1px solid #F0EAE1; padding-top: 18px;">
					<div style="font-size: 13px; font-weight: 700; color: #1E1A17;">Personal Styling &amp; Order Assistance</div>
					<div style="font-size: 12px; color: #787068; margin-top: 5px; line-height: 1.6;">
						%s <a href="mailto:theethnictouchsupport@gmail.com" style="color: #8C5835; text-decoration: none; font-weight: 600;">theethnictouchsupport@gmail.com</a> &nbsp;&bull;&nbsp; 
						%s <a href="https://wa.me/917674855289" style="color: #8C5835; text-decoration: none; font-weight: 600;">+91 7674855289</a>
					</div>
				</div>
			</td>
		</tr>

		<!-- Footer -->
		<tr>
			<td class="footer-cell" style="background: linear-gradient(180deg, #FAF7F2 0%%, #F5EDE2 100%%); border-top: 1.5px solid #D4A373; padding: 22px 20px; text-align: center; font-size: 11.5px; color: #6C655E; line-height: 1.7;">
				<div style="margin-bottom: 8px;">%s</div>
				Authentic Handcrafted Jaipuri Ethnic Wear &bull; Near Khajaguda Lake, Financial District, Hyderabad<br/>
				Open Daily: 10:30 AM to 9:00 PM<br/>
				<a href="https://www.theethnictouch.com" style="color: #8C5835; text-decoration: none; font-weight: 600;">www.theethnictouch.com</a> &nbsp;|&nbsp; 
				<a href="https://share.google/eSxLvWitpLTqdQkn3" style="color: #8C5835; text-decoration: none; font-weight: 600;">Hyderabad Store Location</a>
			</td>
		</tr>
	</table>
</body>
</html>`,
		heroIconHTML,
		badgeHTML,
		headlineText,
		contextIntroText,
		scannerPassHTML,
		iconBoxSVG, order.ID,
		iconShieldSVG, strings.ToUpper(order.PaymentMethod),
		iconTruckSVG, func() string {
			if isPickup {
				return "Hyderabad Store Collection"
			}
			return "Express Pan-India Delivery"
		}(),
		iconShieldSVG,
		iconBoxSVG,
		itemsHTML,
		formatCurrency(subtotalAmt),
		discountRow,
		unlockedGiftRow,
		receiptRowsHTML,
		totalLabel,
		formatCurrency(order.TotalAmount),
		fulfillmentCardHTML,
		iconShieldSVG,
		iconMailSVG,
		iconPhoneSVG,
		footerBrandLogoHTML,
	)
}

func renderOrderConfirmationText(order *models.Order) string {
	name := getCustomerDisplayName(order)
	isPickup := isStorePickup(order)
	isPaid := isOrderPaid(order)

	var sb strings.Builder
	sb.WriteString("THE ETHNIC TOUCH\n")
	sb.WriteString("Authentic Jaipur Craftsmanship • Hyderabad Store\n")
	sb.WriteString("==================================================\n\n")
	sb.WriteString(fmt.Sprintf("Dear %s,\n\n", name))

	if isPickup {
		if isPaid {
			sb.WriteString(fmt.Sprintf("Your Store Pickup Order #%s has been confirmed and is fully paid.\n\n", order.ID))
			sb.WriteString("STATUS: PREPAID STORE PICKUP (FULLY PAID)\n\n")
		} else {
			sb.WriteString(fmt.Sprintf("Your Store Pickup Order #%s has been reserved.\n\n", order.ID))
			sb.WriteString("STATUS: STORE PICKUP RESERVED (PAY AT STORE COUNTER)\n")
			sb.WriteString(fmt.Sprintf("PAYMENT DUE AT COLLECTION: %s\n\n", formatCurrency(order.TotalAmount)))
		}
		sb.WriteString("STORE PICKUP LOCATION:\n")
		sb.WriteString("The Ethnic Touch Store\n")
		sb.WriteString("Near Khajaguda Lake, Financial District, Hyderabad 500075\n")
		sb.WriteString("Hours: Open Daily 10:30 AM – 9:00 PM\n")
		sb.WriteString("Phone: +91 7674855289\n")
		sb.WriteString("Google Maps: https://share.google/eSxLvWitpLTqdQkn3\n\n")
	} else {
		sb.WriteString(fmt.Sprintf("Your Order #%s has been confirmed and is being prepared for dispatch.\n\n", order.ID))
		sb.WriteString("DELIVERY DESTINATION:\n")
		sb.WriteString(fmt.Sprintf("%s\n%s, %s, %s - %s\n",
			order.ShippingName, order.ShippingAddress, order.ShippingCity, order.ShippingState, order.ShippingZIPCode))
		if order.ShippingPhone != "" && order.ShippingPhone != "0000000000" {
			sb.WriteString(fmt.Sprintf("Phone: %s\n", order.ShippingPhone))
		}
		sb.WriteString("\n")
	}

	sb.WriteString("ITEMS IN YOUR ENSEMBLE:\n")
	for _, it := range order.Items {
		sb.WriteString(fmt.Sprintf("- %s (Size: %s) x %d = %s\n", it.ProductName, it.Size, it.Quantity, formatCurrency(it.PriceAtQty*float64(it.Quantity))))
	}
	sb.WriteString(fmt.Sprintf("\nTOTAL AMOUNT: %s\n", formatCurrency(order.TotalAmount)))
	sb.WriteString(fmt.Sprintf("PAYMENT METHOD: %s\n\n", strings.ToUpper(order.PaymentMethod)))
	sb.WriteString("Concierge: theethnictouchsupport@gmail.com | +91 7674855289\n")
	sb.WriteString("Visit us online: https://www.theethnictouch.com\n")
	return sb.String()
}

func renderOrderShippedHTML(order *models.Order, trackingNumber string) string {
	name := getCustomerDisplayName(order)
	itemsHTML := renderOrderItemsTable(order.Items)
	shippingAddress := fmt.Sprintf("%s, %s, %s - %s", order.ShippingAddress, order.ShippingCity, order.ShippingState, order.ShippingZIPCode)

	phoneDisplay := ""
	if order.ShippingPhone != "" && order.ShippingPhone != "0000000000" {
		phoneDisplay = fmt.Sprintf("<br/>%s <strong>Phone:</strong> %s", iconPhoneSVG, order.ShippingPhone)
	}

	trackBtn := ""
	if trackingNumber != "" && trackingNumber != "DELHIVERY_DISPATCHED" && trackingNumber != "DUMMY_TRACKING" {
		trackURL := fmt.Sprintf("https://www.delhivery.com/track/package/%s", trackingNumber)
		trackBtn = fmt.Sprintf(`
		<div style="text-align: center; margin-top: 18px;">
			<a href="%s" style="background: linear-gradient(135deg, #8C5835 0%%, #6E3F21 100%%); color: #FFFFFF; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 28px; border-radius: 25px; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(140, 88, 53, 0.25);">
				Track on Delhivery &rarr;
			</a>
		</div>`, trackURL)
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
	<meta name="x-apple-disable-message-reformatting">
	<title>Your Order Has Shipped - The Ethnic Touch</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet">
	<style>
		@media only screen and (max-width: 600px) {
			.email-container { width: 100%% !important; max-width: 100%% !important; border-radius: 0 !important; }
			.email-body { padding: 12px 6px !important; }
			.header-cell { padding: 22px 14px 18px !important; }
			.content-cell { padding: 20px 14px !important; }
			.footer-cell { padding: 20px 14px !important; }
		}
	</style>
</head>
<body class="email-body" style="margin: 0; padding: 24px 8px; background-color: #FAF8F5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E1A17; -webkit-font-smoothing: antialiased;">
	<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1.5px solid #D4AF37; box-shadow: 0 8px 30px rgba(140, 88, 53, 0.1);">
		<!-- Top Luxury Stripe -->
		<tr>
			<td style="height: 5px; background: linear-gradient(90deg, #8C5835 0%%, #D4A373 50%%, #8C5835 100%%);"></td>
		</tr>

		<!-- Header with Logo -->
		<tr>
			<td class="header-cell" style="padding: 28px 20px 22px 20px; background: linear-gradient(180deg, #FDFCF9 0%%, #F8F3EC 100%%); border-bottom: 2px solid #D4A373; text-align: center;">
				<a href="https://www.theethnictouch.com" style="text-decoration: none; display: inline-block;">
					<img src="https://www.theethnictouch.com/navbar-logo.png" alt="The Ethnic Touch Logo" width="68" height="52" style="display: block; margin: 0 auto 8px auto; max-height: 52px; width: auto; object-fit: contain; border: 0;" />
				</a>
				<div style="font-family: 'Playfair Display', Georgia, serif; font-size: 23px; font-weight: 600; font-style: italic; letter-spacing: 0.5px; color: #1E1A17;">
					The Ethnic Touch
				</div>
				<div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #9B7850; text-transform: uppercase; margin-top: 5px;">
					✦ Authentic Jaipur Craftsmanship &bull; Express Delivery ✦
				</div>
			</td>
		</tr>

		<!-- Content -->
		<tr>
			<td class="content-cell" style="padding: 26px 20px;">
				<div style="text-align: center; margin-bottom: 16px;">
					<span style="background: linear-gradient(135deg, #EFF8F2 0%%, #E0F0E5 100%%); color: #1B5832; border: 1.5px solid #75B58C; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 25px; display: inline-block;">
						DISPATCHED &bull; EXPRESS DELIVERY ON THE WAY
					</span>
				</div>

				<h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 21px; font-weight: 600; color: #1E1A17; margin: 0 0 8px 0; text-align: center; line-height: 1.3;">
					Your Handcrafted Ensembles Have Shipped
				</h1>
				<div style="text-align: center; color: #C99E5F; font-size: 11px; margin-bottom: 16px; letter-spacing: 5px;">❖ ── ✦ ── ❖</div>

				<p style="font-size: 13.5px; line-height: 1.6; color: #5C554E; margin: 0 0 20px 0; text-align: center;">
					Dear %s, your handcrafted Jaipuri package has been packed with artisan tissue and handed over to our logistics partner <strong>Delhivery Express</strong>.
				</p>

				<!-- Tracking Card -->
				<div style="background: linear-gradient(135deg, #FDFBF7 0%%, #F5ECE0 100%%); border: 1.5px solid #D4A373; border-radius: 10px; padding: 18px; margin-bottom: 22px; box-shadow: 0 4px 14px rgba(140, 88, 53, 0.08);">
					<table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
						<tr>
							<td style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Courier Partner</td>
							<td style="font-size: 13px; font-weight: 700; color: #1E1A17; text-align: right;">Delhivery Express ✦ Priority Air</td>
						</tr>
						<tr>
							<td style="padding-top: 10px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Tracking / AWB</td>
							<td style="padding-top: 10px; font-size: 14.5px; font-weight: 700; color: #8C5835; text-align: right; font-family: monospace;">%s</td>
						</tr>
						<tr>
							<td style="padding-top: 10px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Order Reference</td>
							<td style="padding-top: 10px; font-size: 13px; font-weight: 600; color: #1E1A17; text-align: right; font-family: monospace;">#%s</td>
						</tr>
						<tr>
							<td style="padding-top: 10px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Estimated Transit</td>
							<td style="padding-top: 10px; font-size: 13px; font-weight: 600; color: #1B5832; text-align: right;">2 – 4 Business Days</td>
						</tr>
					</table>
					%s
				</div>

				<!-- Shipping Destination Card -->
				<div style="background: #FFFFFF; border: 1.5px solid #E6D8C5; border-radius: 10px; padding: 16px 18px; margin-bottom: 22px;">
					<div style="font-size: 11px; font-weight: 700; color: #78451D; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">%s Shipping Destination</div>
					<div style="font-size: 14px; font-weight: 700; color: #1E1A17;">%s</div>
					<div style="font-size: 13px; color: #5C554E; line-height: 1.6; margin-top: 4px;">
						%s%s
					</div>
				</div>

				<!-- Items Summary -->
				<div style="font-size: 12px; font-weight: 700; color: #1E1A17; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1.5px solid #D4A373; padding-bottom: 6px;">
					%s Items En Route In This Package
				</div>
				%s

				<!-- Concierge -->
				<div style="margin-top: 24px; text-align: center; border-top: 1px solid #F0EAE1; padding-top: 18px;">
					<div style="font-size: 13px; font-weight: 700; color: #1E1A17;">Questions about your delivery?</div>
					<div style="font-size: 12px; color: #787068; margin-top: 5px; line-height: 1.6;">
						%s <a href="mailto:theethnictouchsupport@gmail.com" style="color: #8C5835; text-decoration: none; font-weight: 600;">theethnictouchsupport@gmail.com</a> &nbsp;&bull;&nbsp; 
						%s <a href="https://wa.me/917674855289" style="color: #8C5835; text-decoration: none; font-weight: 600;">Concierge Line: +91 7674855289</a>
					</div>
				</div>
			</td>
		</tr>

		<!-- Footer -->
		<tr>
			<td class="footer-cell" style="background: linear-gradient(180deg, #FAF7F2 0%%, #F5EDE2 100%%); border-top: 1.5px solid #D4A373; padding: 22px 20px; text-align: center; font-size: 11.5px; color: #6C655E; line-height: 1.7;">
				<div style="margin-bottom: 8px;">%s</div>
				Authentic Handcrafted Jaipuri Ethnic Wear &bull; Near Khajaguda Lake, Financial District, Hyderabad<br/>
				Open Daily: 10:30 AM to 9:00 PM<br/>
				<a href="https://www.theethnictouch.com" style="color: #8C5835; text-decoration: none; font-weight: 600;">www.theethnictouch.com</a> &nbsp;|&nbsp; 
				<a href="https://share.google/eSxLvWitpLTqdQkn3" style="color: #8C5835; text-decoration: none; font-weight: 600;">Hyderabad Store Location</a>
			</td>
		</tr>
	</table>
</body>
</html>`,
		name,
		iconTruckSVG,
		iconBoxSVG, trackingNumber,
		iconShieldSVG, order.ID,
		iconClockSVG,
		trackBtn,
		iconPinSVG, order.ShippingName, shippingAddress, phoneDisplay,
		iconBoxSVG,
		itemsHTML,
		iconMailSVG,
		iconPhoneSVG,
		footerBrandLogoHTML,
	)
}

func renderOrderShippedText(order *models.Order, trackingNumber string) string {
	name := getCustomerDisplayName(order)
	var sb strings.Builder
	sb.WriteString("THE ETHNIC TOUCH\n")
	sb.WriteString("Your Order Has Shipped!\n")
	sb.WriteString("==================================================\n\n")
	sb.WriteString(fmt.Sprintf("Dear %s,\n\n", name))
	sb.WriteString(fmt.Sprintf("Your order #%s has been dispatched via Delhivery Express.\n\n", order.ID))
	sb.WriteString(fmt.Sprintf("TRACKING NUMBER: %s\n", trackingNumber))
	sb.WriteString(fmt.Sprintf("TRACK ONLINE: https://www.delhivery.com/track/package/%s\n\n", trackingNumber))
	sb.WriteString("SHIPPING DESTINATION:\n")
	sb.WriteString(fmt.Sprintf("%s\n%s, %s, %s - %s\n",
		order.ShippingName, order.ShippingAddress, order.ShippingCity, order.ShippingState, order.ShippingZIPCode))
	if order.ShippingPhone != "" && order.ShippingPhone != "0000000000" {
		sb.WriteString(fmt.Sprintf("Phone: %s\n", order.ShippingPhone))
	}
	sb.WriteString("\nITEMS EN ROUTE:\n")
	for _, it := range order.Items {
		sb.WriteString(fmt.Sprintf("- %s (Size: %s) x %d\n", it.ProductName, it.Size, it.Quantity))
	}
	sb.WriteString("\nConcierge Support: theethnictouchsupport@gmail.com | +91 7674855289\n")
	sb.WriteString("https://www.theethnictouch.com\n")
	return sb.String()
}

func renderOrderPickedUpHTML(order *models.Order) string {
	name := getCustomerDisplayName(order)
	itemsHTML := renderOrderItemsTable(order.Items)

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
	<meta name="x-apple-disable-message-reformatting">
	<title>Order Picked Up - The Ethnic Touch</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap" rel="stylesheet">
	<style>
		@media only screen and (max-width: 600px) {
			.email-container { width: 100%% !important; max-width: 100%% !important; border-radius: 0 !important; }
			.email-body { padding: 12px 6px !important; }
			.header-cell { padding: 22px 14px 18px !important; }
			.content-cell { padding: 20px 14px !important; }
			.footer-cell { padding: 20px 14px !important; }
		}
	</style>
</head>
<body class="email-body" style="margin: 0; padding: 24px 8px; background-color: #FAF8F5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E1A17; -webkit-font-smoothing: antialiased;">
	<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1.5px solid #D4AF37; box-shadow: 0 8px 30px rgba(140, 88, 53, 0.1);">
		<!-- Top Luxury Stripe -->
		<tr>
			<td style="height: 5px; background: linear-gradient(90deg, #8C5835 0%%, #D4A373 50%%, #8C5835 100%%);"></td>
		</tr>

		<!-- Header with Logo -->
		<tr>
			<td class="header-cell" style="padding: 28px 20px 22px 20px; background: linear-gradient(180deg, #FDFCF9 0%%, #F8F3EC 100%%); border-bottom: 2px solid #D4A373; text-align: center;">
				<a href="https://www.theethnictouch.com" style="text-decoration: none; display: inline-block;">
					<img src="https://www.theethnictouch.com/navbar-logo.png" alt="The Ethnic Touch Logo" width="68" height="52" style="display: block; margin: 0 auto 8px auto; max-height: 52px; width: auto; object-fit: contain; border: 0;" />
				</a>
				<div style="font-family: 'Playfair Display', Georgia, serif; font-size: 23px; font-weight: 600; font-style: italic; letter-spacing: 0.5px; color: #1E1A17;">
					The Ethnic Touch
				</div>
				<div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 2px; color: #9B7850; text-transform: uppercase; margin-top: 5px;">
					✦ Khajaguda Lake Store &bull; Hyderabad ✦
				</div>
			</td>
		</tr>

		<!-- Content -->
		<tr>
			<td class="content-cell" style="padding: 26px 20px;">
				<!-- Celebration / Status Icon -->
				<img src="https://pub-b60b66ffc0d446b288328de25bf9a315.r2.dev/email-assets/check_circle_green.png" alt="Order Picked Up" width="58" height="58" style="display: block; margin: 0 auto 14px auto; width: 58px; height: 58px; border: 0;" />

				<div style="text-align: center; margin-bottom: 16px;">
					<span style="background: linear-gradient(135deg, #FCF8F2 0%%, #F5EADB 100%%); color: #73431A; border: 1.5px solid #C99E5F; font-size: 10.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 14px; border-radius: 25px; display: inline-block;">
						ORDER PICKED UP &bull; COMPLETED
					</span>
				</div>

				<h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 21px; font-weight: 600; color: #1E1A17; margin: 0 0 8px 0; text-align: center; line-height: 1.3;">
					Thank You for Visiting Our Store
				</h1>
				<div style="text-align: center; color: #C99E5F; font-size: 11px; margin-bottom: 16px; letter-spacing: 5px;">❖ ── ✦ ── ❖</div>

				<p style="font-size: 13.5px; line-height: 1.6; color: #5C554E; margin: 0 0 20px 0; text-align: center;">
					Dear %s, it was our absolute pleasure welcoming you to our store near Khajaguda Lake today. We hope you cherish your new handcrafted Jaipuri ensembles and enjoy wearing them for special moments to come.
				</p>

				<!-- Completed Order Details -->
				<table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background: #FDFBF7; border: 1.5px solid #E6D8C5; border-radius: 10px; margin-bottom: 22px; border-collapse: separate; border-spacing: 0; overflow: hidden; width: 100%%;">
					<tr>
						<td style="padding: 12px 14px; border-right: 1px solid #E6D8C5; width: 50%%;">
							<div style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Order Reference</div>
							<div style="font-size: 13.5px; font-weight: 700; color: #1E1A17; margin-top: 3px; font-family: monospace;">#%s</div>
						</td>
						<td style="padding: 12px 14px; width: 50%%;">
							<div style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #8A735E; font-weight: 600;">%s Total Amount Paid</div>
							<div style="font-size: 14.5px; font-weight: 700; color: #8C5835; margin-top: 3px;">%s</div>
						</td>
					</tr>
				</table>

				<!-- Picked Up Items -->
				<div style="font-size: 12px; font-weight: 700; color: #1E1A17; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1.5px solid #D4A373; padding-bottom: 6px;">
					%s Garments Collected Today
				</div>
				%s

				<!-- Artisan Garment Care Box -->
				<div style="background: #FAF7F2; border: 1.5px dashed #D4A373; border-radius: 10px; padding: 16px; margin-top: 20px;">
					<div style="font-size: 11.5px; font-weight: 700; color: #78451D; text-transform: uppercase; letter-spacing: 0.8px;">%s Pure Cotton &amp; Dye Care Guide</div>
					<div style="font-size: 12.5px; color: #5C554E; line-height: 1.6; margin-top: 7px;">
						&bull; <strong>Gentle Cold Hand Wash:</strong> Protects vegetable &amp; mineral dyes using mild liquid detergent.<br/>
						&bull; <strong>Dry Inside-Out in Shade:</strong> Always hang in natural breeze away from direct noon sun.<br/>
						&bull; <strong>Medium Reverse Iron:</strong> Iron gently on reverse side for crisp artisan drape.
					</div>
				</div>

				<!-- Invitation Box -->
				<div style="margin-top: 24px; text-align: center; border-top: 1px solid #F0EAE1; padding-top: 18px;">
					<div style="font-size: 13px; font-weight: 700; color: #1E1A17;">We Look Forward to Welcoming You Again</div>
					<div style="font-size: 12px; color: #787068; margin-top: 5px; line-height: 1.6;">
						We refresh our Jaipuri store collections regularly.<br/>
						%s <a href="mailto:theethnictouchsupport@gmail.com" style="color: #8C5835; text-decoration: none; font-weight: 600;">theethnictouchsupport@gmail.com</a> &nbsp;&bull;&nbsp; 
						%s <a href="https://wa.me/917674855289" style="color: #8C5835; text-decoration: none; font-weight: 600;">+91 7674855289</a>
					</div>
				</div>
			</td>
		</tr>

		<!-- Footer -->
		<tr>
			<td class="footer-cell" style="background: linear-gradient(180deg, #FAF7F2 0%%, #F5EDE2 100%%); border-top: 1.5px solid #D4A373; padding: 22px 20px; text-align: center; font-size: 11.5px; color: #6C655E; line-height: 1.7;">
				<div style="margin-bottom: 8px;">%s</div>
				Authentic Handcrafted Jaipuri Ethnic Wear &bull; Near Khajaguda Lake, Financial District, Hyderabad<br/>
				Open Daily: 10:30 AM to 9:00 PM<br/>
				<a href="https://www.theethnictouch.com" style="color: #8C5835; text-decoration: none; font-weight: 600;">www.theethnictouch.com</a> &nbsp;|&nbsp; 
				<a href="https://share.google/eSxLvWitpLTqdQkn3" style="color: #8C5835; text-decoration: none; font-weight: 600;">Hyderabad Store Location</a>
			</td>
		</tr>
	</table>
</body>
</html>`,
		name,
		iconBoxSVG, order.ID,
		iconShieldSVG, formatCurrency(order.TotalAmount),
		iconBoxSVG,
		itemsHTML,
		iconShieldSVG,
		iconMailSVG,
		iconPhoneSVG,
		footerBrandLogoHTML,
	)
}

func renderOrderPickedUpText(order *models.Order) string {
	name := getCustomerDisplayName(order)
	var sb strings.Builder
	sb.WriteString("THE ETHNIC TOUCH\n")
	sb.WriteString("Thank You for Visiting Our Store!\n")
	sb.WriteString("==================================================\n\n")
	sb.WriteString(fmt.Sprintf("Dear %s,\n\n", name))
	sb.WriteString(fmt.Sprintf("Your Store Pickup Order #%s has been completed.\n\n", order.ID))
	sb.WriteString("GARMENTS COLLECTED:\n")
	for _, it := range order.Items {
		sb.WriteString(fmt.Sprintf("- %s (Size: %s) x %d\n", it.ProductName, it.Size, it.Quantity))
	}
	sb.WriteString(fmt.Sprintf("\nTOTAL AMOUNT PAID: %s\n\n", formatCurrency(order.TotalAmount)))
	sb.WriteString("PURE COTTON & DYE CARE GUIDE:\n")
	sb.WriteString("- Gentle cold wash with mild detergent\n")
	sb.WriteString("- Dry inside-out in shade\n")
	sb.WriteString("- Medium iron on reverse side\n\n")
	sb.WriteString("We look forward to seeing you again at our Khajaguda Lake store!\n")
	sb.WriteString("https://www.theethnictouch.com\n")
	return sb.String()
}
