package service

import (
	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
	"fmt"
	"time"
)

type ProductService interface {
	GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error)
	CreateProduct(p *models.Product) error
	GetReviews(productID string) ([]models.ProductReview, error)
	CreateReview(rev *models.ProductReview) error
}

type productService struct {
	repo repository.ProductRepository
}

func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error) {
	return s.repo.GetProducts(filters)
}

func (s *productService) CreateProduct(p *models.Product) error {
	// Business logic
	uniqueSuffix := fmt.Sprint(time.Now().UnixNano() % 100000)
	prefix := "p_prod"
	if len(p.Name) >= 2 {
		prefix = "p_" + p.Name[:2]
	}
	p.ID = prefix + "_" + uniqueSuffix
	
	now := time.Now().UTC().Format(time.RFC3339)
	p.CreatedAt = now

	return s.repo.CreateProduct(p)
}

func (s *productService) GetReviews(productID string) ([]models.ProductReview, error) {
	return s.repo.GetReviews(productID)
}

func (s *productService) CreateReview(rev *models.ProductReview) error {
	if rev.Rating < 1 || rev.Rating > 5 {
		return fmt.Errorf("invalid rating: must be between 1 and 5")
	}
	rev.CreatedAt = time.Now().Format(time.RFC3339)
	return s.repo.CreateReview(rev)
}
