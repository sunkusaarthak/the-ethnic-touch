package handlers

import (
	"encoding/json"
	"fmt"
	"html"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/service"
)

type ConfigHandler struct {
	configSvc service.ConfigService
	couponSvc service.CouponService
}

func NewConfigHandler(configSvc service.ConfigService, couponSvc service.CouponService) *ConfigHandler {
	return &ConfigHandler{
		configSvc: configSvc,
		couponSvc: couponSvc,
	}
}

func (h *ConfigHandler) HandleGetSpinConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	config, err := h.configSvc.GetSpinWheelConfig()
	if err != nil {
		http.Error(w, "Failed to load config", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func (h *ConfigHandler) HandleUpdateSpinConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var config models.SpinWheelConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}

	if err := h.configSvc.UpdateSpinWheelConfig(&config); err != nil {
		http.Error(w, "Failed to update config", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Config updated successfully"})
}

func (h *ConfigHandler) HandleGetSpinStats(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	stats, err := h.configSvc.GetSpinWheelStats()
	if err != nil {
		http.Error(w, "Failed to load stats", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

func (h *ConfigHandler) HandleGetAuthConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	config, err := h.configSvc.GetAuthConfig()
	if err != nil {
		http.Error(w, "Failed to load auth config", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func (h *ConfigHandler) HandleUpdateAuthConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var config models.AuthConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}

	if err := h.configSvc.UpdateAuthConfig(&config); err != nil {
		http.Error(w, "Failed to update auth config", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Auth Config updated successfully"})
}

func (h *ConfigHandler) HandleGetCheckoutConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	config, err := h.configSvc.GetCheckoutConfig()
	if err != nil {
		http.Error(w, "Failed to load checkout config", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func (h *ConfigHandler) HandleUpdateCheckoutConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var config models.CheckoutConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}

	if config.ShippingCutoffHour < 0 || config.ShippingCutoffHour > 23 {
		http.Error(w, "shipping_cutoff_hour must be between 0 and 23", http.StatusBadRequest)
		return
	}
	if config.PickupHoldHours < 0 {
		http.Error(w, "pickup_hold_hours must be 0 or greater", http.StatusBadRequest)
		return
	}

	if err := h.configSvc.UpdateCheckoutConfig(&config); err != nil {
		http.Error(w, "Failed to update checkout config", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Checkout Config updated successfully"})
}

func (h *ConfigHandler) recalculateFlashDropTiming(fd *models.FlashDropConfig) {
	now := time.Now()

	// If mode is manual, check if expires_at has passed
	if fd.Mode == "manual" {
		if fd.ExpiresAt != "" {
			expiresTime, err := time.Parse(time.RFC3339, fd.ExpiresAt)
			if err == nil {
				if now.After(expiresTime) {
					// Time has expired! Revert to random rotation
					fd.Mode = "random"
					fd.ExpiresAt = ""
					go func() {
						if currentCfg, err := h.configSvc.GetHomepageConfig(); err == nil {
							currentCfg.FlashDrop.Mode = "random"
							currentCfg.FlashDrop.ExpiresAt = ""
							_ = h.configSvc.UpdateHomepageConfig(currentCfg)
						}
					}()
				} else {
					diff := expiresTime.Sub(now)
					remSec := int(diff.Seconds())
					if remSec < 0 {
						remSec = 0
					}
					fd.HoursLeft = remSec / 3600
					fd.MinutesLeft = (remSec % 3600) / 60
					fd.SecondsLeft = remSec % 60
					return
				}
			} else {
				fd.Mode = "random"
			}
		} else {
			fd.Mode = "random"
		}
	}

	// For random mode (or auto-reverted):
	// Cycle through products deterministically or dynamically using configured cycle interval
	totalCycleMins := fd.DurationHours*60 + fd.DurationMins
	if totalCycleMins <= 0 {
		totalCycleMins = 360 // default 6 hours
		fd.DurationHours = 6
		fd.DurationMins = 0
	}
	cycleSec := int64(totalCycleMins * 60)

	var startTime time.Time
	if fd.CycleStartedAt != "" {
		if t, err := time.Parse(time.RFC3339, fd.CycleStartedAt); err == nil {
			startTime = t
		}
	}
	if startTime.IsZero() || startTime.After(now) {
		startTime = now
		fd.CycleStartedAt = now.Format(time.RFC3339)
	}

	elapsedSec := int64(now.Sub(startTime).Seconds())
	if elapsedSec < 0 {
		elapsedSec = 0
	}

	remSec := int(cycleSec - (elapsedSec % cycleSec))
	if remSec < 0 {
		remSec = 0
	}
	fd.HoursLeft = remSec / 3600
	fd.MinutesLeft = (remSec % 3600) / 60
	fd.SecondsLeft = remSec % 60
	if fd.Mode == "" {
		fd.Mode = "random"
	}
}

func (h *ConfigHandler) HandleGetHomepageConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	config, err := h.configSvc.GetHomepageConfig()
	if err != nil {
		http.Error(w, "Failed to load homepage config", http.StatusInternalServerError)
		return
	}

	h.recalculateFlashDropTiming(&config.FlashDrop)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func (h *ConfigHandler) HandleUpdateHomepageConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var config models.HomepageConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}

	if config.FlashDrop.Mode == "manual" {
		if config.FlashDrop.ExpiresAt == "" {
			totalMins := config.FlashDrop.DurationHours*60 + config.FlashDrop.DurationMins
			if totalMins <= 0 {
				totalMins = 360
			}
			config.FlashDrop.ExpiresAt = time.Now().Add(time.Duration(totalMins) * time.Minute).Format(time.RFC3339)
		}
	} else {
		config.FlashDrop.Mode = "random"
		config.FlashDrop.ExpiresAt = ""
	}

	if err := h.configSvc.UpdateHomepageConfig(&config); err != nil {
		http.Error(w, "Failed to update homepage config", http.StatusInternalServerError)
		return
	}

	if h.couponSvc != nil && config.VipVoucher.Code != "" {
		code := strings.ToUpper(strings.TrimSpace(config.VipVoucher.Code))
		disc := float64(config.VipVoucher.DiscountPercent)
		if disc <= 0 {
			disc = 10
		}
		_ = h.couponSvc.CreateCoupon(&models.Coupon{
			ID:         "cp_" + strings.ToLower(code),
			Code:       code,
			Type:       "percentage",
			Value:      disc,
			MinOrder:   0,
			IsActive:   true,
			UsageLimit: 100000,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Homepage Config updated successfully"})
}

func (h *ConfigHandler) HandleFlashDropConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		homepageConfig, err := h.configSvc.GetHomepageConfig()
		if err != nil {
			http.Error(w, "Failed to load config", http.StatusInternalServerError)
			return
		}
		h.recalculateFlashDropTiming(&homepageConfig.FlashDrop)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"flash_drop":  homepageConfig.FlashDrop,
			"server_time": time.Now().Format(time.RFC3339),
		})
		return
	}

	if r.Method == http.MethodPut || r.Method == http.MethodPost {
		var req models.FlashDropConfig
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid input data: "+err.Error(), http.StatusBadRequest)
			return
		}

		homepageConfig, err := h.configSvc.GetHomepageConfig()
		if err != nil {
			http.Error(w, "Failed to load current homepage config", http.StatusInternalServerError)
			return
		}

		if req.Mode == "manual" {
			totalMins := req.DurationHours*60 + req.DurationMins
			if totalMins <= 0 {
				totalMins = 360 // default 6 hours
				req.DurationHours = 6
				req.DurationMins = 0
			}
			req.ExpiresAt = time.Now().Add(time.Duration(totalMins) * time.Minute).Format(time.RFC3339)
		} else {
			req.Mode = "random"
			req.ExpiresAt = ""
			if req.DurationHours <= 0 && req.DurationMins <= 0 {
				req.DurationHours = 6
				req.DurationMins = 0
			}
			req.CycleStartedAt = time.Now().Format(time.RFC3339)
		}

		homepageConfig.FlashDrop = req
		h.recalculateFlashDropTiming(&homepageConfig.FlashDrop)

		if err := h.configSvc.UpdateHomepageConfig(homepageConfig); err != nil {
			http.Error(w, "Failed to save flash drop configuration", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"message":     "Flash Spotlight Drop configuration updated successfully",
			"flash_drop":  homepageConfig.FlashDrop,
			"server_time": time.Now().Format(time.RFC3339),
		})
		return
	}

	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

func (h *ConfigHandler) HandleUpdateInstagramConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut && r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var instaConfig models.InstagramConfig
	if err := json.NewDecoder(r.Body).Decode(&instaConfig); err != nil {
		http.Error(w, "Invalid input data: "+err.Error(), http.StatusBadRequest)
		return
	}

	homepageConfig, err := h.configSvc.GetHomepageConfig()
	if err != nil {
		http.Error(w, "Failed to load current homepage config", http.StatusInternalServerError)
		return
	}

	homepageConfig.Instagram = instaConfig

	if err := h.configSvc.UpdateHomepageConfig(homepageConfig); err != nil {
		http.Error(w, "Failed to update Instagram configuration", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":   "Instagram Reels configuration updated successfully",
		"instagram": homepageConfig.Instagram,
	})
}

// HandleFetchInstagramThumbnail fetches and caches the authentic thumbnail of any Instagram Reel URL
func (h *ConfigHandler) HandleFetchInstagramThumbnail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		URL string `json:"url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.URL == "" {
		http.Error(w, "Missing or invalid Instagram URL", http.StatusBadRequest)
		return
	}

	thumbURL, reelCode, err := fetchAndSaveInstaThumbnail(req.URL)
	if err != nil {
		http.Error(w, "Failed to fetch Instagram thumbnail: "+err.Error(), http.StatusInternalServerError)
		return
	}

	videoURL := ""
	if reelCode != "" {
		if v, vErr := fetchInstaVideoURL(reelCode); vErr == nil {
			videoURL = v
			reelVideoCacheMu.Lock()
			reelVideoCache[reelCode] = cachedReelVideo{
				url:       v,
				expiresAt: time.Now().Add(24 * time.Hour),
			}
			reelVideoCacheMu.Unlock()
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":   true,
		"thumbnail": thumbURL,
		"videoUrl":  videoURL,
		"reelCode":  reelCode,
	})
}

type cachedReelVideo struct {
	url       string
	expiresAt time.Time
}

var (
	reelVideoCache   = make(map[string]cachedReelVideo)
	reelVideoCacheMu sync.RWMutex
)

// HandleGetInstagramReelVideo resolves direct playable MP4 video stream from an Instagram Reel code/URL
func (h *ConfigHandler) HandleGetInstagramReelVideo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	code := r.URL.Query().Get("code")
	rawURL := r.URL.Query().Get("url")

	if code == "" && rawURL != "" {
		reCode := regexp.MustCompile(`/reel/([A-Za-z0-9_-]+)`)
		if m := reCode.FindStringSubmatch(rawURL); len(m) > 1 {
			code = m[1]
		}
	}

	if code == "" {
		http.Error(w, "Missing reel code or url parameter", http.StatusBadRequest)
		return
	}

	// Check cache
	reelVideoCacheMu.RLock()
	if item, found := reelVideoCache[code]; found && time.Now().Before(item.expiresAt) {
		reelVideoCacheMu.RUnlock()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":  true,
			"videoUrl": item.url,
			"reelCode": code,
			"cached":   true,
		})
		return
	}
	reelVideoCacheMu.RUnlock()

	// Fetch directly from Instagram embed
	videoURL, err := fetchInstaVideoURL(code)
	if err != nil {
		http.Error(w, "Failed to resolve reel video: "+err.Error(), http.StatusBadGateway)
		return
	}

	// Cache for 24 hours
	reelVideoCacheMu.Lock()
	reelVideoCache[code] = cachedReelVideo{
		url:       videoURL,
		expiresAt: time.Now().Add(24 * time.Hour),
	}
	reelVideoCacheMu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":  true,
		"videoUrl": videoURL,
		"reelCode": code,
		"cached":   false,
	})
}

func fetchInstaVideoURL(reelCode string) (string, error) {
	embedURL := fmt.Sprintf("https://www.instagram.com/reel/%s/embed/", reelCode)

	client := &http.Client{Timeout: 12 * time.Second}
	req, err := http.NewRequest("GET", embedURL, nil)
	if err != nil {
		return "", fmt.Errorf("invalid request: %w", err)
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")

	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to fetch instagram embed: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	bodyStr := string(bodyBytes)
	re := regexp.MustCompile(`video_url\\*":\\*"([^"]+?\.mp4[^"]*?)"`)
	matches := re.FindStringSubmatch(bodyStr)
	if len(matches) < 2 {
		return "", fmt.Errorf("video_url not found in embed")
	}

	rawVideoURL := matches[1]
	cleanURL := strings.ReplaceAll(rawVideoURL, `\/`, `/`)
	cleanURL = strings.ReplaceAll(cleanURL, `\`, "")
	cleanURL = strings.ReplaceAll(cleanURL, `\u0026`, "&")

	return cleanURL, nil
}

// HandleSyncAllInstagramThumbnails iterates over all configured reels and refreshes thumbnails from Instagram
func (h *ConfigHandler) HandleSyncAllInstagramThumbnails(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	hpConfig, err := h.configSvc.GetHomepageConfig()
	if err != nil {
		http.Error(w, "Failed to load homepage config", http.StatusInternalServerError)
		return
	}

	updatedCount := 0
	for i := range hpConfig.Instagram.Reels {
		reel := &hpConfig.Instagram.Reels[i]
		if reel.InstagramURL != "" {
			thumbPath, code, err := fetchAndSaveInstaThumbnail(reel.InstagramURL)
			if err == nil && thumbPath != "" {
				reel.Thumbnail = thumbPath
				if code != "" && reel.ReelCode == "" {
					reel.ReelCode = code
				}
				updatedCount++
			}
		}
	}

	if err := h.configSvc.UpdateHomepageConfig(hpConfig); err != nil {
		http.Error(w, "Failed to update homepage config: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success":      true,
		"updatedCount": updatedCount,
		"reels":        hpConfig.Instagram.Reels,
	})
}

func fetchAndSaveInstaThumbnail(rawURL string) (string, string, error) {
	// Extract reel code if present
	reCode := regexp.MustCompile(`/reel/([A-Za-z0-9_-]+)`)
	matches := reCode.FindStringSubmatch(rawURL)
	reelCode := ""
	if len(matches) > 1 {
		reelCode = matches[1]
	}

	client := &http.Client{
		Timeout: 15 * time.Second,
	}

	req, err := http.NewRequest("GET", rawURL, nil)
	if err != nil {
		return "", reelCode, fmt.Errorf("invalid request: %w", err)
	}
	req.Header.Set("User-Agent", "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html)")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")

	resp, err := client.Do(req)
	if err != nil {
		return "", reelCode, fmt.Errorf("failed to fetch instagram page: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", reelCode, fmt.Errorf("failed to read response: %w", err)
	}

	bodyStr := string(bodyBytes)
	ogImageRe := regexp.MustCompile(`(?i)<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']`)
	ogMatches := ogImageRe.FindStringSubmatch(bodyStr)
	if len(ogMatches) < 2 {
		ogImageRe2 := regexp.MustCompile(`(?i)<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']`)
		ogMatches = ogImageRe2.FindStringSubmatch(bodyStr)
	}

	if len(ogMatches) < 2 {
		return "", reelCode, fmt.Errorf("could not find og:image in instagram response")
	}

	imgURL := html.UnescapeString(ogMatches[1])

	// Download image bytes from Instagram CDN
	imgReq, err := http.NewRequest("GET", imgURL, nil)
	if err != nil {
		return "", reelCode, fmt.Errorf("failed to create image request: %w", err)
	}
	imgReq.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

	imgResp, err := client.Do(imgReq)
	if err != nil {
		return "", reelCode, fmt.Errorf("failed to download image: %w", err)
	}
	defer imgResp.Body.Close()

	if imgResp.StatusCode != http.StatusOK {
		return "", reelCode, fmt.Errorf("image download returned status %d", imgResp.StatusCode)
	}

	imgBytes, err := io.ReadAll(imgResp.Body)
	if err != nil {
		return "", reelCode, fmt.Errorf("failed to read image bytes: %w", err)
	}

	// Create directory if not exists
	outDir := filepath.Join("frontend", "public", "images", "reels")
	if err := os.MkdirAll(outDir, 0755); err != nil {
		return "", reelCode, fmt.Errorf("failed to create reels dir: %w", err)
	}

	fileName := ""
	if reelCode != "" {
		fileName = fmt.Sprintf("reel_%s.jpg", reelCode)
	} else {
		fileName = fmt.Sprintf("reel_%d.jpg", time.Now().UnixNano())
	}

	// Try uploading to Cloudflare R2 if configured (production)
	if r2URL, err := uploadToR2(imgBytes, fileName, "image/jpeg"); err == nil && r2URL != "" {
		return r2URL, reelCode, nil
	}

	filePath := filepath.Join(outDir, fileName)
	if err := os.WriteFile(filePath, imgBytes, 0644); err != nil {
		return "", reelCode, fmt.Errorf("failed to save image to disk: %w", err)
	}

	thumbLocalPath := fmt.Sprintf("/images/reels/%s", fileName)
	return thumbLocalPath, reelCode, nil
}


