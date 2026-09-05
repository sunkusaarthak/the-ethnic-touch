package service

import (
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
	"time"
)

type ContactService interface {
	CreateMessage(msg *models.ContactMessage) error
	GetMessages() ([]models.ContactMessage, error)
	GetUnreadCount() (int, error)
	MarkMessageRead(id int) error
}

type contactService struct {
	repo repository.ContactRepository
}

func NewContactService(repo repository.ContactRepository) ContactService {
	return &contactService{repo: repo}
}

func (s *contactService) CreateMessage(msg *models.ContactMessage) error {
	msg.Status = "unread"
	msg.CreatedAt = time.Now().UTC().Format(time.RFC3339)
	return s.repo.CreateMessage(msg)
}

func (s *contactService) GetMessages() ([]models.ContactMessage, error) {
	return s.repo.GetMessages()
}

func (s *contactService) GetUnreadCount() (int, error) {
	return s.repo.GetUnreadCount()
}

func (s *contactService) MarkMessageRead(id int) error {
	return s.repo.UpdateMessageStatus(id, "read")
}
