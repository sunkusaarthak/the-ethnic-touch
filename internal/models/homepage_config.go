package models

type InstagramReelItem struct {
	ID           string   `json:"id"`
	IsHitReel    bool     `json:"is_hit_reel"`
	InstagramURL string   `json:"instagram_url"`
	ReelCode     string   `json:"reel_code"`
	Title        string   `json:"title"`
	Caption      string   `json:"caption"`
	Author       string   `json:"author"`
	Likes        string   `json:"likes"`
	Views        string   `json:"views"`
	Thumbnail    string   `json:"thumbnail"`
	VideoURL     string   `json:"video_url,omitempty"`
	ProductID    string   `json:"product_id"`
	Product      *Product `json:"product,omitempty"`
}

type InstagramConfig struct {
	Handle     string              `json:"handle"`
	ProfileURL string              `json:"profile_url"`
	Reels      []InstagramReelItem `json:"reels"`
}

type AnnouncementItem struct {
	Text string `json:"text"`
	Icon string `json:"icon"`
}

type HeroSlideItem struct {
	ID               int    `json:"id"`
	Tag              string `json:"tag"`
	TitlePrefix      string `json:"title_prefix"`
	TitleHighlight   string `json:"title_highlight"`
	Desc             string `json:"desc"`
	PrimaryCtaText   string `json:"primary_cta_text"`
	PrimaryCtaLink   string `json:"primary_cta_link"`
	SecondaryCtaText string `json:"secondary_cta_text"`
	SecondaryCtaLink string `json:"secondary_cta_link"`
	Image            string `json:"image"`
	Rating           string `json:"rating"`
	Patrons          string `json:"patrons"`
	Badge            string `json:"badge"`
}

type FlashDropConfig struct {
	Mode           string  `json:"mode"`                      // "random" or "manual"
	ProductID      string  `json:"product_id"`                // Selected product ID
	ImageURL       string  `json:"image_url,omitempty"`       // Product image URL
	Price          float64 `json:"price,omitempty"`           // Product display price
	OriginalPrice  float64 `json:"original_price,omitempty"`  // Product original / strike price
	ExpiresAt      string  `json:"expires_at"`                // RFC3339 timestamp when manual spotlight expires
	CycleStartedAt string  `json:"cycle_started_at,omitempty"` // RFC3339 timestamp when current rotation cycle started
	DurationHours  int     `json:"duration_hours"`            // Configured duration hours (e.g. 6)
	DurationMins   int     `json:"duration_mins"`             // Configured duration minutes (e.g. 0)
	Title          string  `json:"title"`
	Highlight      string  `json:"highlight"`
	Desc           string  `json:"desc"`
	HoursLeft      int     `json:"hours_left"`
	MinutesLeft    int     `json:"minutes_left"`
	SecondsLeft    int     `json:"seconds_left"`
	RemainingStock int     `json:"remaining_stock"`
	TotalStock     int     `json:"total_stock"`
	BadgeText      string  `json:"badge_text,omitempty"`
	FeatureText    string  `json:"feature_text,omitempty"`
}

type LookbookHotspot struct {
	ID        int    `json:"id"`
	Top       string `json:"top"`
	Left      string `json:"left"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Image     string `json:"image"`
	Link      string `json:"link"`
	ProductID string `json:"product_id"`
}

type LookbookConfig struct {
	Tag      string            `json:"tag"`
	Title    string            `json:"title"`
	Desc     string            `json:"desc"`
	Image    string            `json:"image"`
	Hotspots []LookbookHotspot `json:"hotspots"`
}

type ReviewItem struct {
	ID          int    `json:"id"`
	Author      string `json:"author"`
	Location    string `json:"location"`
	Initials    string `json:"initials"`
	ProductWorn string `json:"product_worn"`
	Rating      int    `json:"rating"`
	Quote       string `json:"quote"`
}

type VipVoucherConfig struct {
	Code            string `json:"code"`
	DiscountPercent int    `json:"discount_percent"`
	Title           string `json:"title"`
	Desc            string `json:"desc"`
}

type HomepageConfig struct {
	Instagram     InstagramConfig    `json:"instagram"`
	Announcements []AnnouncementItem `json:"announcements"`
	HeroSlides    []HeroSlideItem    `json:"hero_slides"`
	FlashDrop     FlashDropConfig    `json:"flash_drop"`
	Lookbook      LookbookConfig     `json:"lookbook"`
	Reviews       []ReviewItem       `json:"reviews"`
	VipVoucher    VipVoucherConfig   `json:"vip_voucher"`
}
