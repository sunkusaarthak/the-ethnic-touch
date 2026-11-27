package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/mail"
	"strings"
)

type resendEmail struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	ReplyTo string   `json:"reply_to"`
	Subject string   `json:"subject"`
	HTML    string   `json:"html"`
	Text    string   `json:"text"`
}

func (s *emailService) resendAPIKey() string {
	if s.cfg == nil {
		return ""
	}
	return strings.TrimSpace(s.cfg.ResendAPIKey)
}

func (s *emailService) sendViaResend(apiKey, fromName, replyTo, to, subject, htmlBody, textBody string) error {
	sender, err := mail.ParseAddress(strings.TrimSpace(s.cfg.EmailFromAddress))
	if err != nil {
		return fmt.Errorf("EMAIL_FROM_ADDRESS must be a valid Resend sender address")
	}
	sender.Name = fromName
	reply, err := mail.ParseAddress(replyTo)
	if err != nil {
		return fmt.Errorf("EMAIL_REPLY_TO must be a valid email address")
	}

	payload, err := json.Marshal(resendEmail{
		From:    sender.String(),
		To:      []string{to},
		ReplyTo: reply.Address,
		Subject: subject,
		HTML:    htmlBody,
		Text:    textBody,
	})
	if err != nil {
		return fmt.Errorf("encode Resend email: %w", err)
	}
	req, err := http.NewRequest(http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(payload))
	if err != nil {
		return fmt.Errorf("create Resend request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")
	resp, err := s.resendClient.Do(req)
	if err != nil {
		return fmt.Errorf("send email via Resend: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("Resend rejected the email (HTTP %d)", resp.StatusCode)
	}

	var result struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(io.LimitReader(resp.Body, 8<<10)).Decode(&result); err != nil || result.ID == "" {
		return fmt.Errorf("Resend response did not confirm acceptance (missing message ID)")
	}
	log.Printf("[Email] Resend accepted message %q", result.ID)
	return nil
}
