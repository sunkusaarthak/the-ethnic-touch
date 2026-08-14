package repository

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"strings"

	"ethnictouch/internal/models"
)

type ProductRepository interface {
	GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error)
	CreateProduct(p *models.Product) error
	UpdateProduct(p *models.Product) error
	DeleteProduct(id string) error
	GetReviews(productID string) ([]models.ProductReview, error)
	CreateReview(rev *models.ProductReview) error
}

type postgresProductRepo struct {
	db *sql.DB
}

func NewProductRepository(db *sql.DB) ProductRepository {
	return &postgresProductRepo{db: db}
}

func (r *postgresProductRepo) GetProducts(filters map[string]string) ([]models.Product, map[string]interface{}, error) {
	idParam := filters["id"]
	q := filters["q"]
	categoryParam := filters["category"]
	sizesParam := filters["sizes"]
	colorsParam := filters["colors"]
	fabricsParam := filters["fabrics"]
	sleeveTypesParam := filters["sleeveTypes"]
	neckTypesParam := filters["neckTypes"]
	patternsParam := filters["patterns"]
	occasionsParam := filters["occasions"]
	collectionParam := filters["collection"]

	minPriceStr := filters["minPrice"]
	maxPriceStr := filters["maxPrice"]
	minRatingStr := filters["minRating"]
	inStockOnlyStr := filters["inStockOnly"]
	minDiscountStr := filters["minDiscount"]

	newArrivalStr := filters["newArrival"]
	bestSellerStr := filters["bestSeller"]
	featuredStr := filters["featured"]
	sortBy := filters["sortBy"]

	paginated := filters["paginated"] == "true"
	pageStr := filters["page"]
	limitStr := filters["limit"]

	var conditions []string
	var args []interface{}
	argIndex := 1

	if idParam != "" {
		conditions = append(conditions, fmt.Sprintf("p.id = $%d", argIndex))
		args = append(args, idParam)
		argIndex++
	}

	if q != "" {
		tokens := strings.Fields(strings.ToLower(q))
		var tokenConds []string
		for _, token := range tokens {
			tokenConds = append(tokenConds, fmt.Sprintf("(LOWER(p.id) LIKE $%d OR LOWER(p.name) LIKE $%d OR LOWER(p.category) LIKE $%d OR LOWER(p.collection) LIKE $%d OR LOWER(p.fabric) LIKE $%d OR LOWER(p.color) LIKE $%d OR LOWER(p.sleeve_type) LIKE $%d OR LOWER(p.neck_type) LIKE $%d OR LOWER(p.pattern) LIKE $%d OR LOWER(p.occasion) LIKE $%d OR LOWER(p.sku) LIKE $%d OR LOWER(p.description) LIKE $%d OR LOWER(p.tags) LIKE $%d)", argIndex, argIndex, argIndex, argIndex, argIndex, argIndex, argIndex, argIndex, argIndex, argIndex, argIndex, argIndex, argIndex))
			args = append(args, "%"+token+"%")
			argIndex++
		}
		if len(tokenConds) > 0 {
			conditions = append(conditions, "("+strings.Join(tokenConds, " AND ")+")")
		}
	}

	if categoryParam != "" {
		categories := strings.Split(categoryParam, ",")
		var catConds []string
		for _, cat := range categories {
			catConds = append(catConds, fmt.Sprintf("LOWER(p.category) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(cat))
			argIndex++
		}
		if len(catConds) > 0 {
			conditions = append(conditions, "("+strings.Join(catConds, " OR ")+")")
		}
	}

	if sizesParam != "" {
		sizes := strings.Split(sizesParam, ",")
		var sizeConds []string
		for _, sz := range sizes {
			sizeConds = append(sizeConds, fmt.Sprintf("(',' || p.sizes || ',') LIKE $%d", argIndex))
			args = append(args, "%,"+strings.TrimSpace(sz)+",%")
			argIndex++
		}
		if len(sizeConds) > 0 {
			conditions = append(conditions, "("+strings.Join(sizeConds, " OR ")+")")
		}
	}

	if colorsParam != "" {
		colors := strings.Split(colorsParam, ",")
		var colConds []string
		for _, col := range colors {
			colConds = append(colConds, fmt.Sprintf("LOWER(p.color) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(col))
			argIndex++
		}
		if len(colConds) > 0 {
			conditions = append(conditions, "("+strings.Join(colConds, " OR ")+")")
		}
	}

	if fabricsParam != "" {
		fabrics := strings.Split(fabricsParam, ",")
		var fabConds []string
		for _, fab := range fabrics {
			fabConds = append(fabConds, fmt.Sprintf("LOWER(p.fabric) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(fab))
			argIndex++
		}
		if len(fabConds) > 0 {
			conditions = append(conditions, "("+strings.Join(fabConds, " OR ")+")")
		}
	}

	if collectionParam != "" {
		collections := strings.Split(collectionParam, ",")
		var colConds []string
		for _, col := range collections {
			colConds = append(colConds, fmt.Sprintf("LOWER(p.collection) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(col))
			argIndex++
		}
		if len(colConds) > 0 {
			conditions = append(conditions, "("+strings.Join(colConds, " OR ")+")")
		}
	}

	if sleeveTypesParam != "" {
		sleeveTypes := strings.Split(sleeveTypesParam, ",")
		var slConds []string
		for _, sl := range sleeveTypes {
			slConds = append(slConds, fmt.Sprintf("LOWER(p.sleeve_type) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(sl))
			argIndex++
		}
		if len(slConds) > 0 {
			conditions = append(conditions, "("+strings.Join(slConds, " OR ")+")")
		}
	}

	if neckTypesParam != "" {
		neckTypes := strings.Split(neckTypesParam, ",")
		var nkConds []string
		for _, nk := range neckTypes {
			nkConds = append(nkConds, fmt.Sprintf("LOWER(p.neck_type) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(nk))
			argIndex++
		}
		if len(nkConds) > 0 {
			conditions = append(conditions, "("+strings.Join(nkConds, " OR ")+")")
		}
	}

	if patternsParam != "" {
		patterns := strings.Split(patternsParam, ",")
		var patConds []string
		for _, pat := range patterns {
			patConds = append(patConds, fmt.Sprintf("LOWER(p.pattern) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(pat))
			argIndex++
		}
		if len(patConds) > 0 {
			conditions = append(conditions, "("+strings.Join(patConds, " OR ")+")")
		}
	}

	if occasionsParam != "" {
		occasions := strings.Split(occasionsParam, ",")
		var occConds []string
		for _, occ := range occasions {
			occConds = append(occConds, fmt.Sprintf("LOWER(p.occasion) = LOWER($%d)", argIndex))
			args = append(args, strings.TrimSpace(occ))
			argIndex++
		}
		if len(occConds) > 0 {
			conditions = append(conditions, "("+strings.Join(occConds, " OR ")+")")
		}
	}

	if minPriceStr != "" {
		if minP, err := strconv.ParseFloat(minPriceStr, 64); err == nil && minP > 0 {
			conditions = append(conditions, fmt.Sprintf("p.price >= $%d", argIndex))
			args = append(args, minP)
			argIndex++
		}
	}
	if maxPriceStr != "" {
		if maxP, err := strconv.ParseFloat(maxPriceStr, 64); err == nil && maxP > 0 {
			conditions = append(conditions, fmt.Sprintf("p.price <= $%d", argIndex))
			args = append(args, maxP)
			argIndex++
		}
	}
	if minRatingStr != "" {
		if minR, err := strconv.ParseFloat(minRatingStr, 64); err == nil && minR > 0 {
			conditions = append(conditions, fmt.Sprintf("COALESCE(r.avg_rating, 0.0) >= $%d", argIndex))
			args = append(args, minR)
			argIndex++
		}
	}
	if inStockOnlyStr == "true" {
		conditions = append(conditions, "p.stock > 0")
	}
	if minDiscountStr != "" {
		if minD, err := strconv.ParseFloat(minDiscountStr, 64); err == nil && minD > 0 {
			conditions = append(conditions, fmt.Sprintf("p.original_price > 0 AND ((p.original_price - p.price) * 100 / p.original_price) >= $%d", argIndex))
			args = append(args, minD)
			argIndex++
		}
	}
	if newArrivalStr == "true" {
		conditions = append(conditions, "p.is_new_arrival = TRUE")
	}
	if bestSellerStr == "true" {
		conditions = append(conditions, "p.is_best_seller = TRUE")
	}
	if featuredStr == "true" {
		conditions = append(conditions, "p.is_featured = TRUE")
	}

	baseQuery := `
		SELECT 
			p.id, p.name, p.description, p.price, p.image_url, p.stock, p.category, 
			COALESCE(p.sizes, ''), COALESCE(p.sizes_stock, '{}'),
			COALESCE(p.collection, ''), COALESCE(p.fabric, ''), COALESCE(p.color, ''), 
			COALESCE(p.sleeve_type, ''), COALESCE(p.neck_type, ''), COALESCE(p.pattern, ''), 
			COALESCE(p.occasion, ''), COALESCE(p.sku, ''), COALESCE(p.tags, ''), 
			COALESCE(p.original_price, 0), p.is_new_arrival, p.is_best_seller, p.is_featured, 
			COALESCE(p.created_at, ''),
			COALESCE(r.avg_rating, 0.0) as avg_rating,
			COALESCE(r.review_count, 0) as review_count
		FROM products p
		LEFT JOIN (
			SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count 
			FROM product_reviews GROUP BY product_id
		) r ON p.id = r.product_id
		WHERE 1=1
	`
	if len(conditions) > 0 {
		baseQuery += " AND " + strings.Join(conditions, " AND ")
	}

	sortOrder := "p.id DESC"
	switch sortBy {
	case "newest":
		sortOrder = "p.created_at DESC, p.id DESC"
	case "popularity", "best_selling":
		sortOrder = "p.is_best_seller DESC, p.id DESC"
	case "rating":
		sortOrder = "COALESCE(r.avg_rating, 0.0) DESC, r.review_count DESC, p.id DESC"
	case "price_asc":
		sortOrder = "p.price ASC, p.id DESC"
	case "price_desc":
		sortOrder = "p.price DESC, p.id DESC"
	case "discount":
		sortOrder = "CASE WHEN p.original_price > 0 THEN ((p.original_price - p.price) / p.original_price) ELSE 0 END DESC, p.id DESC"
	case "az":
		sortOrder = "p.name ASC, p.id DESC"
	case "za":
		sortOrder = "p.name DESC, p.id DESC"
	}
	baseQuery += " ORDER BY " + sortOrder

	var total int
	if paginated {
		countQuery := `
			SELECT COUNT(*) 
			FROM products p
			LEFT JOIN (
				SELECT product_id, AVG(rating) as avg_rating, COUNT(*) as review_count 
				FROM product_reviews GROUP BY product_id
			) r ON p.id = r.product_id
			WHERE 1=1
		`
		if len(conditions) > 0 {
			countQuery += " AND " + strings.Join(conditions, " AND ")
		}
		if err := r.db.QueryRow(countQuery, args...).Scan(&total); err != nil {
			return nil, nil, err
		}
	}

	page := 1
	limit := 12
	if paginated {
		if pVal, err := strconv.Atoi(pageStr); err == nil && pVal > 0 {
			page = pVal
		}
		if lVal, err := strconv.Atoi(limitStr); err == nil && lVal > 0 {
			limit = lVal
		}
		offset := (page - 1) * limit
		baseQuery += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argIndex, argIndex+1)
		args = append(args, limit, offset)
	}

	rows, err := r.db.Query(baseQuery, args...)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()

	products := []models.Product{}
	for rows.Next() {
		var p models.Product
		var sizesStr string
		var sizesStockStr string
		if err := rows.Scan(
			&p.ID, &p.Name, &p.Description, &p.Price, &p.ImageURL, &p.Stock, &p.Category,
			&sizesStr, &sizesStockStr,
			&p.Collection, &p.Fabric, &p.Color, &p.SleeveType, &p.NeckType, &p.Pattern,
			&p.Occasion, &p.SKU, &p.Tags, &p.OriginalPrice, &p.IsNewArrival, &p.IsBestSeller,
			&p.IsFeatured, &p.CreatedAt, &p.AvgRating, &p.ReviewCount,
		); err != nil {
			return nil, nil, err
		}
		if sizesStr != "" {
			p.Sizes = strings.Split(sizesStr, ",")
		} else {
			p.Sizes = []string{}
		}
		p.SizesStock = map[string]int{}
		if sizesStockStr != "" {
			json.Unmarshal([]byte(sizesStockStr), &p.SizesStock)
		}
		if p.ImageURL != "" {
			p.GalleryImages = append(p.GalleryImages, p.ImageURL)
		}
		products = append(products, p)
	}
	rows.Close()

	// Safely populate gallery images after main rows are closed
	for i := range products {
		imgRows, err := r.db.Query("SELECT image_url FROM product_images WHERE product_id = $1", products[i].ID)
		if err == nil {
			for imgRows.Next() {
				var url string
				if err := imgRows.Scan(&url); err == nil {
					products[i].GalleryImages = append(products[i].GalleryImages, url)
				}
			}
			imgRows.Close()
		}
	}

	var meta map[string]interface{}
	if paginated {
		totalPages := int(math.Ceil(float64(total) / float64(limit)))
		meta = map[string]interface{}{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		}
	}
	return products, meta, nil
}

func (r *postgresProductRepo) CreateProduct(p *models.Product) error {
	sizesStr := strings.Join(p.Sizes, ",")
	sizesStockBytes, _ := json.Marshal(p.SizesStock)
	sizesStockStr := string(sizesStockBytes)
	if sizesStockStr == "" || sizesStockStr == "null" {
		sizesStockStr = "{}"
	}

	totalStock := 0
	for _, qty := range p.SizesStock {
		totalStock += qty
	}
	if totalStock > 0 {
		p.Stock = totalStock
	}

	_, err := r.db.Exec(`
		INSERT INTO products (
			id, name, description, price, image_url, sizes, sizes_stock, stock, category,
			collection, fabric, color, sleeve_type, neck_type, pattern, occasion,
			sku, tags, original_price, is_new_arrival, is_best_seller, is_featured, created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)`,
		p.ID, p.Name, p.Description, p.Price, p.ImageURL, sizesStr, sizesStockStr, p.Stock, p.Category,
		p.Collection, p.Fabric, p.Color, p.SleeveType, p.NeckType, p.Pattern, p.Occasion,
		p.SKU, p.Tags, p.OriginalPrice, p.IsNewArrival, p.IsBestSeller, p.IsFeatured, p.CreatedAt)
	if err != nil {
		return err
	}

	for i, imgURL := range p.GalleryImages {
		if i == 0 {
			continue // Main image is already inserted in products table
		}
		trimmed := strings.TrimSpace(imgURL)
		if trimmed == "" {
			continue
		}
		r.db.Exec("INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)", p.ID, trimmed)
	}

	return nil
}

func (r *postgresProductRepo) UpdateProduct(p *models.Product) error {
	sizesStr := strings.Join(p.Sizes, ",")
	sizesStockBytes, _ := json.Marshal(p.SizesStock)
	sizesStockStr := string(sizesStockBytes)
	if sizesStockStr == "" || sizesStockStr == "null" {
		sizesStockStr = "{}"
	}

	totalStock := 0
	for _, qty := range p.SizesStock {
		totalStock += qty
	}
	if totalStock > 0 {
		p.Stock = totalStock
	}

	_, err := r.db.Exec(`
		UPDATE products SET 
			name = $1, description = $2, price = $3, image_url = $4, sizes = $5, sizes_stock = $6, stock = $7, 
			category = $8, collection = $9, fabric = $10, color = $11, sleeve_type = $12, neck_type = $13, 
			pattern = $14, occasion = $15, sku = $16, tags = $17, original_price = $18, is_new_arrival = $19, 
			is_best_seller = $20, is_featured = $21
		WHERE id = $22`,
		p.Name, p.Description, p.Price, p.ImageURL, sizesStr, sizesStockStr, p.Stock,
		p.Category, p.Collection, p.Fabric, p.Color, p.SleeveType, p.NeckType,
		p.Pattern, p.Occasion, p.SKU, p.Tags, p.OriginalPrice, p.IsNewArrival,
		p.IsBestSeller, p.IsFeatured, p.ID)
	if err != nil {
		return fmt.Errorf("failed to update product: %w", err)
	}

	// Update gallery images (delete old, insert new)
	_, err = r.db.Exec("DELETE FROM product_images WHERE product_id = $1", p.ID)
	if err != nil {
		return fmt.Errorf("failed to delete old gallery images: %w", err)
	}

	for i, gImg := range p.GalleryImages {
		if i == 0 {
			continue // Main image is already in the products table
		}
		trimmed := strings.TrimSpace(gImg)
		if trimmed == "" {
			continue
		}
		_, err := r.db.Exec("INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)", p.ID, trimmed)
		if err != nil {
			return fmt.Errorf("failed to insert gallery image: %w", err)
		}
	}

	return nil
}

func (r *postgresProductRepo) DeleteProduct(id string) error {
	// First, remove the foreign key reference from historical order items 
	// (so we don't break past orders that purchased this product)
	_, err := r.db.Exec("UPDATE order_items SET product_id = NULL WHERE product_id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to detach product from order items: %w", err)
	}

	// Now we can safely delete the product (cascade will handle images, reviews, etc.)
	_, err = r.db.Exec("DELETE FROM products WHERE id = $1", id)
	if err != nil {
		return fmt.Errorf("failed to delete product: %w", err)
	}
	return nil
}

func (r *postgresProductRepo) GetReviews(productID string) ([]models.ProductReview, error) {
	rows, err := r.db.Query("SELECT id, user_name, user_email, rating, comment, created_at FROM product_reviews WHERE product_id = $1 ORDER BY created_at DESC", productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []models.ProductReview
	for rows.Next() {
		var rev models.ProductReview
		if err := rows.Scan(&rev.ID, &rev.UserName, &rev.UserEmail, &rev.Rating, &rev.Comment, &rev.CreatedAt); err == nil {
			rev.ProductID = productID
			reviews = append(reviews, rev)
		}
	}
	return reviews, nil
}

func (r *postgresProductRepo) CreateReview(rev *models.ProductReview) error {
	return r.db.QueryRow("INSERT INTO product_reviews (product_id, user_name, user_email, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
		rev.ProductID, rev.UserName, rev.UserEmail, rev.Rating, rev.Comment, rev.CreatedAt).Scan(&rev.ID)
}
