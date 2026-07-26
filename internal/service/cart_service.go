package service

import (
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

type CartService interface {
	GetCart(userID string) ([]repository.CartItemResponse, error)
	AddToCart(userID, productID string, quantity int, size string) error
	RemoveFromCart(userID, productID, size string) error
	ClearCart(userID string) error
	GetWishlist(userID string) ([]models.Product, error)
	AddToWishlist(userID, productID string) error
	RemoveFromWishlist(userID, productID string) error
	MergeWishlist(userID string, productIDs []string) error
}

type cartService struct {
	repo repository.CartRepository
}

func NewCartService(repo repository.CartRepository) CartService {
	return &cartService{repo: repo}
}

func (s *cartService) GetCart(userID string) ([]repository.CartItemResponse, error) {
	return s.repo.GetCart(userID)
}

func (s *cartService) AddToCart(userID, productID string, quantity int, size string) error {
	if quantity <= 0 {
		quantity = 1
	}
	return s.repo.AddToCart(userID, productID, quantity, size)
}

func (s *cartService) RemoveFromCart(userID, productID, size string) error {
	return s.repo.RemoveFromCart(userID, productID, size)
}

func (s *cartService) ClearCart(userID string) error {
	return s.repo.ClearCart(userID)
}

func (s *cartService) GetWishlist(userID string) ([]models.Product, error) {
	return s.repo.GetWishlist(userID)
}

func (s *cartService) AddToWishlist(userID, productID string) error {
	return s.repo.AddToWishlist(userID, productID)
}

func (s *cartService) RemoveFromWishlist(userID, productID string) error {
	return s.repo.RemoveFromWishlist(userID, productID)
}

func (s *cartService) MergeWishlist(userID string, productIDs []string) error {
	return s.repo.MergeWishlist(userID, productIDs)
}
