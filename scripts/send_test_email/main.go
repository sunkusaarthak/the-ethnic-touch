package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"

	"ethnictouch/internal/config"
	"ethnictouch/internal/service"
)

func main() {
	_ = godotenv.Load()

	if len(os.Args) < 2 {
		fmt.Println("Usage: go run ./scripts/send_test_email/main.go <recipient-email> [type]")
		fmt.Println("Types: prepaid_pickup, unpaid_pickup, delivery, shipped, picked_up, all (default: prepaid_pickup)")
		os.Exit(1)
	}

	recipient := strings.TrimSpace(os.Args[1])
	emailType := "prepaid_pickup"
	if len(os.Args) >= 3 {
		emailType = strings.TrimSpace(os.Args[2])
	}

	cfg := config.LoadConfig()
	emailSvc := service.NewEmailService(cfg)

	if !emailSvc.IsConfigured() {
		log.Fatal("Configure RESEND_API_KEY and EMAIL_FROM_ADDRESS, or Gmail SMTP credentials, before sending a test email.")
	} else if strings.TrimSpace(cfg.ResendAPIKey) != "" {
		fmt.Println("Sending test email through the Resend HTTPS API.")
	} else {
		fmt.Printf("Connecting to SMTP host %s:%s...\n", cfg.SMTPHost, cfg.SMTPPort)
		if err := emailSvc.VerifyConnection(); err != nil {
			log.Fatalf("SMTP Connection check failed: %v", err)
		}
		fmt.Println("SMTP Connection verified successfully!")
	}

	typesToSend := []string{emailType}
	if emailType == "all" {
		typesToSend = []string{"prepaid_pickup", "unpaid_pickup", "delivery", "shipped", "picked_up"}
	}

	for _, t := range typesToSend {
		subject, html, err := emailSvc.GeneratePreview(t)
		if err != nil {
			log.Fatalf("Error generating preview for %s: %v", t, err)
		}

		fmt.Printf("\nDelivering '%s' to %s...\n", t, recipient)
		fmt.Printf("Subject: %s\n", subject)

		err = emailSvc.SendEmail(recipient, subject, html, "Please enable HTML viewing to see your designer order notification.")
		if err != nil {
			log.Fatalf("Failed to deliver test email: %v", err)
		}
		fmt.Printf("Provider accepted '%s' for %s. Check the recipient inbox to verify delivery.\n", t, recipient)
	}

	fmt.Println("\nAll requested test emails completed!")
}
