package repository

import (
	"database/sql"
	"encoding/json"

	"ethnictouch/internal/models"
)

type ConfigRepository interface {
	GetSpinWheelConfig() (*models.SpinWheelConfig, error)
	UpdateSpinWheelConfig(config *models.SpinWheelConfig) error
	GetSpinWheelStats() (*models.SpinWheelStats, error)
	UpdateSpinWheelStats(stats *models.SpinWheelStats) error
	GetAuthConfig() (*models.AuthConfig, error)
	UpdateAuthConfig(config *models.AuthConfig) error
	GetCheckoutConfig() (*models.CheckoutConfig, error)
	UpdateCheckoutConfig(config *models.CheckoutConfig) error
	GetHomepageConfig() (*models.HomepageConfig, error)
	UpdateHomepageConfig(config *models.HomepageConfig) error
}

type configRepository struct {
	db *sql.DB
}

func NewConfigRepository(db *sql.DB) ConfigRepository {
	return &configRepository{db: db}
}

func (r *configRepository) GetSpinWheelConfig() (*models.SpinWheelConfig, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'spin_wheel_config'").Scan(&val)
	if err != nil {
		return nil, err
	}

	var config models.SpinWheelConfig
	if err := json.Unmarshal([]byte(val), &config); err != nil {
		return nil, err
	}
	return &config, nil
}

func (r *configRepository) UpdateSpinWheelConfig(config *models.SpinWheelConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('spin_wheel_config', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func (r *configRepository) GetSpinWheelStats() (*models.SpinWheelStats, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'spin_wheel_stats'").Scan(&val)
	if err != nil {
		return nil, err
	}

	var stats models.SpinWheelStats
	if err := json.Unmarshal([]byte(val), &stats); err != nil {
		return nil, err
	}
	return &stats, nil
}

func (r *configRepository) UpdateSpinWheelStats(stats *models.SpinWheelStats) error {
	data, err := json.Marshal(stats)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('spin_wheel_stats', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func (r *configRepository) GetAuthConfig() (*models.AuthConfig, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'auth_config'").Scan(&val)
	if err == sql.ErrNoRows {
		// Default to true if not set yet
		return &models.AuthConfig{PhoneAuthEnabled: true}, nil
	}
	if err != nil {
		return nil, err
	}

	var config models.AuthConfig
	if err := json.Unmarshal([]byte(val), &config); err != nil {
		return nil, err
	}
	return &config, nil
}

func (r *configRepository) UpdateAuthConfig(config *models.AuthConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('auth_config', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func (r *configRepository) GetCheckoutConfig() (*models.CheckoutConfig, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'checkout_config'").Scan(&val)
	if err == sql.ErrNoRows {
		// Default to all enabled
		return &models.CheckoutConfig{
			StandardDeliveryEnabled:      true,
			HyderabadInstantEnabled:      true,
			StorePickupPrepayEnabled:     true,
			StorePickupPayInStoreEnabled: true,
		}, nil
	}
	if err != nil {
		return nil, err
	}

	var config models.CheckoutConfig
	if err := json.Unmarshal([]byte(val), &config); err != nil {
		return nil, err
	}
	return &config, nil
}

func (r *configRepository) UpdateCheckoutConfig(config *models.CheckoutConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('checkout_config', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func (r *configRepository) GetHomepageConfig() (*models.HomepageConfig, error) {
	var val string
	err := r.db.QueryRow("SELECT value FROM system_config WHERE key = 'homepage_config'").Scan(&val)
	if err == sql.ErrNoRows {
		defaultCfg := getDefaultHomepageConfig()
		_ = r.UpdateHomepageConfig(defaultCfg)
		return defaultCfg, nil
	}
	if err != nil {
		return nil, err
	}

	var config models.HomepageConfig
	if err := json.Unmarshal([]byte(val), &config); err != nil {
		defaultCfg := getDefaultHomepageConfig()
		_ = r.UpdateHomepageConfig(defaultCfg)
		return defaultCfg, nil
	}

	// Auto-migrate to current brand copy and store details if legacy mock data detected
	if len(config.Lookbook.Hotspots) > 0 && (config.Lookbook.Hotspots[0].ProductID == "1" || len(config.Announcements) == 0) {
		defaultCfg := getDefaultHomepageConfig()
		_ = r.UpdateHomepageConfig(defaultCfg)
		return defaultCfg, nil
	}

	// Ensure customer reviews locations match requested branding: Hyderabad, Hyderabad, Vizag
	needsReviewUpdate := false
	for i := range config.Reviews {
		if (config.Reviews[i].Author == "Ananya R." || config.Reviews[i].ID == 1) && config.Reviews[i].Location != "Hyderabad" {
			config.Reviews[i].Location = "Hyderabad"
			needsReviewUpdate = true
		}
		if (config.Reviews[i].Author == "Sneha K." || config.Reviews[i].ID == 2) && config.Reviews[i].Location != "Hyderabad" {
			config.Reviews[i].Location = "Hyderabad"
			needsReviewUpdate = true
		}
		if (config.Reviews[i].Author == "Pooja M." || config.Reviews[i].ID == 3) && config.Reviews[i].Location != "Vizag" {
			config.Reviews[i].Location = "Vizag"
			needsReviewUpdate = true
		}
	}
	if len(config.Reviews) >= 3 {
		if config.Reviews[0].Location != "Hyderabad" {
			config.Reviews[0].Location = "Hyderabad"
			needsReviewUpdate = true
		}
		if config.Reviews[1].Location != "Hyderabad" {
			config.Reviews[1].Location = "Hyderabad"
			needsReviewUpdate = true
		}
		if config.Reviews[2].Location != "Vizag" {
			config.Reviews[2].Location = "Vizag"
			needsReviewUpdate = true
		}
	}
	if needsReviewUpdate {
		_ = r.UpdateHomepageConfig(&config)
	}

	return &config, nil
}

func (r *configRepository) UpdateHomepageConfig(config *models.HomepageConfig) error {
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(`
		INSERT INTO system_config (key, value) VALUES ('homepage_config', $1)
		ON CONFLICT (key) DO UPDATE SET value = $1
	`, string(data))
	return err
}

func getDefaultHomepageConfig() *models.HomepageConfig {
	return &models.HomepageConfig{
		Instagram: models.InstagramConfig{
			Handle:     "theethnictouch.co",
			ProfileURL: "https://www.instagram.com/theethnictouch.co",
			Reels: []models.InstagramReelItem{
				{
					ID:           "reel-hit",
					IsHitReel:    true,
					InstagramURL: "https://www.instagram.com/theethnictouch.co/reel/DejumS8Cwm2/",
					ReelCode:     "DejumS8Cwm2",
					Title:        "Our Hit Paisley Print Kurti ✨",
					Caption:      "Pure handcrafted Jaipur cotton kurti with timeless floral paisley motifs.",
					Author:       "@theethnictouch.co",
					Likes:        "Trending Hit",
					Views:        "Featured Reel",
					Thumbnail:    "/images/reels/reel-hit.jpg",
					ProductID:    "p_Pi_88000",
				},
				{
					ID:           "reel-2",
					IsHitReel:    false,
					InstagramURL: "https://www.instagram.com/reel/DeZZezHTEWX",
					ReelCode:     "DeZZezHTEWX",
					Title:        "Olive Green Floral Print Kurti 🌿",
					Caption:      "Crisp straight-cut silhouette designed for long workdays and casual outings.",
					Author:       "@theethnictouch.co",
					Likes:        "Patron Favorite",
					Views:        "Latest Drop",
					Thumbnail:    "/images/reels/reel-2.jpg",
					ProductID:    "p_Ol_98900",
				},
				{
					ID:           "reel-3",
					IsHitReel:    false,
					InstagramURL: "https://www.instagram.com/theethnictouch.co/reel/De14lUDiWWN/",
					ReelCode:     "De14lUDiWWN",
					Title:        "Mustard Yellow Mandala Short Kurti ☀️",
					Caption:      "Breezy sleeveless cut with intricate white circular medallion prints.",
					Author:       "@theethnictouch.co",
					Likes:        "Best Seller",
					Views:        "Latest Drop",
					Thumbnail:    "/images/reels/reel-3.jpg",
					ProductID:    "p_Mu_31700",
				},
				{
					ID:           "reel-4",
					IsHitReel:    false,
					InstagramURL: "https://www.instagram.com/theethnictouch.co/reel/Deo8CMTixAn/",
					ReelCode:     "Deo8CMTixAn",
					Title:        "Chocolate Brown Textured Straight Kurti 🌸",
					Caption:      "Pure breathable cotton kurti, Brown Jaipur Kurti, Bell Sleeve.",
					Author:       "@theethnictouch.co",
					Likes:        "Must Have",
					Views:        "Latest Drop",
					Thumbnail:    "/images/reels/reel-4.jpg",
					ProductID:    "p_Ch_40100",
				},
			},
		},
		Announcements: []models.AnnouncementItem{
			{Text: "Visit our store near Khajaguda Lake, Hyderabad", Icon: "map-pin"},
			{Text: "Free Delivery on orders above \u20B91499 across India", Icon: "truck"},
			{Text: "100% Pure Jaipur Cotton & Breathable Fabrics", Icon: "sparkles"},
			{Text: "Everyday Comfort for Office & Daily Wear under \u20B9599", Icon: "tag"},
			{Text: "Direct from Jaipur Artisans to your Doorstep", Icon: "shield"},
		},
		HeroSlides: []models.HeroSlideItem{
			{
				ID:               1,
				Tag:              "✦ KHAJAGUDA STORE & ONLINE",
				TitlePrefix:      "Effortless Grace for ",
				TitleHighlight:   "Every Day",
				Desc:             "Exploring our curated collection of artisanal kurtis, crafted for comfort and celebration.",
				PrimaryCtaText:   "Explore Collection",
				PrimaryCtaLink:   "/shop",
				SecondaryCtaText: "Discover Our Story",
				SecondaryCtaLink: "/about",
				Image:            "./images/hero_banner.png",
				Rating:           "4.9/5",
				Patrons:          "Hyderabad & Pan-India",
				Badge:            "100% Pure Cotton",
			},
			{
				ID:               2,
				Tag:              "Everyday Comfort \u2022 Pure Cotton",
				TitlePrefix:      "Comfortable Everyday Kurtis in ",
				TitleHighlight:   "Pure Cotton",
				Desc:             "Breathable, soft, and easy to wear all day. Handpicked Jaipur prints for office, college, and daily outings starting at just \u20B9449.",
				PrimaryCtaText:   "Shop All Kurtis",
				PrimaryCtaLink:   "/shop",
				SecondaryCtaText: "Under \u20B9500",
				SecondaryCtaLink: "/shop?priceRange=under-500",
				Image:            "./images/kurthi_peach.png",
				Rating:           "4.95/5",
				Patrons:          "Customer Favorite",
				Badge:            "Handpicked Prints",
			},
			{
				ID:               3,
				Tag:              "Khajaguda Store & Online",
				TitlePrefix:      "Mustard & Olive ",
				TitleHighlight:   "Short Tunics",
				Desc:             "Lightweight, breezy cuts made for hot days and easy pairing with pants, palazzos, or jeans. Priced honestly under \u20B9599.",
				PrimaryCtaText:   "Discover Tunics",
				PrimaryCtaLink:   "/shop?category=Tunic",
				SecondaryCtaText: "Get Directions",
				SecondaryCtaLink: "https://share.google/eSxLvWitpLTqdQkn3",
				Image:            "./images/kurthi_mint.png",
				Rating:           "4.88/5",
				Patrons:          "Daily Essentials",
				Badge:            "Breathable Cotton",
			},
		},
		FlashDrop: models.FlashDropConfig{
			Mode:           "random",
			DurationHours:  6,
			DurationMins:   0,
			Title:          "Customer Favorite: ",
			Highlight:      "Pink Paisley Cotton Kurti",
			Desc:           "Crafted in 100% soft Jaipur cotton with vibrant floral paisley motifs. Perfect for daily wear and office comfort. Only a few pieces left in stock!",
			HoursLeft:      5,
			MinutesLeft:    42,
			SecondsLeft:    19,
			RemainingStock: 4,
			TotalStock:     25,
			ProductID:      "p_Pi_88000",
			BadgeText:      "SELLING FAST",
			FeatureText:    "100% Pure Breathable Cotton",
		},
		Lookbook: models.LookbookConfig{
			Tag:   "How To Wear It",
			Title: "Office & Casual Cotton Looks",
			Desc:  "Bright, comfortable kurtis made from breathable cotton that keep you feeling fresh throughout busy days.",
			Image: "./images/login_art.png",
			Hotspots: []models.LookbookHotspot{
				{
					ID:        1,
					Top:       "55%",
					Left:      "51%",
					Name:      "Mustard Yellow Mandala Print Short Kurti",
					Price:     449,
					Image:     "./images/login_art.png",
					Link:      "/product/p_Mu_31700/kurti",
					ProductID: "p_Mu_31700",
				},
				{
					ID:        2,
					Top:       "55%",
					Left:      "51%",
					Name:      "Pink Paisley Printed Straight Kurti",
					Price:     549,
					Image:     "./images/kurthi_peach.png",
					Link:      "/product/p_Pi_88000/kurti",
					ProductID: "p_Pi_88000",
				},
			},
		},
		Reviews: []models.ReviewItem{
			{
				ID:          1,
				Author:      "Ananya R.",
				Location:    "Hyderabad",
				Initials:    "AR",
				ProductWorn: "Mustard Yellow Mandala Print Kurti",
				Rating:      5,
				Quote:       "Visited their store near Khajaguda Lake and bought 2 cotton kurtis. The fabric is so soft and comfortable in the Hyderabad heat. Great prices too!",
			},
			{
				ID:          2,
				Author:      "Sneha K.",
				Location:    "Hyderabad",
				Initials:    "SK",
				ProductWorn: "Pink Paisley Straight Kurti",
				Rating:      5,
				Quote:       "Ordered online and received in 3 days. The pink paisley print looks even prettier in person. Perfect for office wear.",
			},
			{
				ID:          3,
				Author:      "Pooja M.",
				Location:    "Vizag",
				Initials:    "PM",
				ProductWorn: "Olive Green Floral Short Kurti",
				Rating:      5,
				Quote:       "Finally found affordable pure cotton kurtis under \u20B9550 that don't shrink or fade after washing. Highly recommended!",
			},
		},
		VipVoucher: models.VipVoucherConfig{
			Code:            "WELCOME10",
			DiscountPercent: 10,
			Title:           "Get 10% Off Your First Order",
			Desc:            "Use code WELCOME10 at checkout to get an extra 10% off on your first kurti order today!",
		},
	}
}
