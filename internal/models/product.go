package models

// Product represents an item in our store catalog
type Product struct {
	ID            string         `json:"id"`
	Name          string         `json:"name"`
	Description   string         `json:"description"`
	Price         float64        `json:"price"`
	ImageURL      string         `json:"imageUrl"`
	GalleryImages []string       `json:"galleryImages"`
	Sizes         []string       `json:"sizes"`
	SizesStock    map[string]int `json:"sizesStock"` // Maps size string (e.g. "S") to stock count
	Stock         int            `json:"stock"`
	Category      string         `json:"category"`
	Collection    string         `json:"collection"`
	Fabric        string         `json:"fabric"`
	Color         string         `json:"color"`
	SleeveType    string         `json:"sleeveType"`
	NeckType      string         `json:"neckType"`
	Pattern       string         `json:"pattern"`
	Occasion      string         `json:"occasion"`
	SKU           string         `json:"sku"`
	Tags          string         `json:"tags"`
	OriginalPrice float64        `json:"originalPrice"`
	IsNewArrival  bool           `json:"isNewArrival"`
	IsBestSeller  bool           `json:"isBestSeller"`
	IsFeatured    bool           `json:"isFeatured"`
	CreatedAt     string         `json:"createdAt"`
	AvgRating     float64        `json:"avgRating"`
	ReviewCount   int            `json:"reviewCount"`
}

// ProductReview represents a customer rating and comment
type ProductReview struct {
	ID        int    `json:"id"`
	ProductID string `json:"productId"`
	UserName  string `json:"userName"`
	UserEmail string `json:"userEmail"`
	Rating    int    `json:"rating"`
	Comment   string `json:"comment"`
	CreatedAt string `json:"createdAt"`
}
