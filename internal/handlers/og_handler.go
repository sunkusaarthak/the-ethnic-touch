package handlers

import (
	"image"
	_ "image/jpeg"
	"image/jpeg"
	_ "image/png"
	"net/http"
	"path/filepath"
	"strings"

	"ethnictouch/internal/service"

	"github.com/fogleman/gg"
	"github.com/golang/freetype/truetype"
	"golang.org/x/image/draw"
	"golang.org/x/image/font/gofont/gobold"
)

type OgHandler struct {
	ProductService service.ProductService
}

func NewOgHandler(ps service.ProductService) *OgHandler {
	return &OgHandler{ProductService: ps}
}

func (h *OgHandler) HandleOgImage(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	idStr := strings.TrimPrefix(path, "/api/og-image/")
	idStr = strings.TrimSuffix(idStr, ".jpg")

	if idStr == "" {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	product, err := h.ProductService.GetProductByID(idStr)
	if err != nil || product == nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	// 1. Load original product image (Support both external URLs and local files)
	var img image.Image
	var imgErr error
	
	if strings.HasPrefix(product.ImageURL, "http://") || strings.HasPrefix(product.ImageURL, "https://") {
		resp, err := http.Get(product.ImageURL)
		if err == nil {
			defer resp.Body.Close()
			img, _, imgErr = image.Decode(resp.Body)
		} else {
			imgErr = err
		}
	} else {
		imagePath := filepath.Join("frontend", "public", product.ImageURL)
		img, imgErr = gg.LoadImage(imagePath)
	}

	if imgErr != nil || img == nil {
		img, err = gg.LoadImage(filepath.Join("frontend", "public", "images", "kurthi_peach.png"))
		if err != nil {
			http.Error(w, "Could not load fallback image", http.StatusInternalServerError)
			return
		}
	}

	// 2. Set up the Canvas with a Polaroid-style banner at the bottom
	wImg := img.Bounds().Dx()
	hImg := img.Bounds().Dy()
	
	// Banner height relative to image width (e.g. 20% of width)
	bannerH := int(float64(wImg) * 0.20)
	
	dc := gg.NewContext(wImg, hImg + bannerH)
	
	// Fill entirely with premium soft cream background to match website
	dc.SetHexColor("#faf7f2")
	dc.Clear()
	
	// 3. Draw the full product image at the top
	dc.DrawImage(img, 0, 0)

	// Add a thin gold separator line between image and banner
	dc.SetHexColor("#9c6c40")
	dc.DrawLine(0, float64(hImg), float64(wImg), float64(hImg))
	dc.SetLineWidth(3)
	dc.Stroke()

	// 4. Draw logo in the banner (Left aligned)
	padding := int(float64(wImg) * 0.04)
	logoPath := filepath.Join("frontend", "public", "navbar-logo.png")
	logoImg, err := gg.LoadImage(logoPath)
	
	textStartX := float64(padding)
	
	if err == nil {
		// Logo takes up 60% of banner height
		logoScale := float64(bannerH) * 0.6 / float64(logoImg.Bounds().Dy())
		newLW := int(float64(logoImg.Bounds().Dx()) * logoScale)
		newLH := int(float64(logoImg.Bounds().Dy()) * logoScale)
		
		scaledLogo := image.NewRGBA(image.Rect(0, 0, newLW, newLH))
		draw.ApproxBiLinear.Scale(scaledLogo, scaledLogo.Bounds(), logoImg, logoImg.Bounds(), draw.Over, nil)
		
		logoY := hImg + (bannerH - newLH)/2
		dc.DrawImage(scaledLogo, padding, logoY)
		
		textStartX = float64(padding + newLW + padding)
	}

	// 5. Draw Product Name in the banner
	boldFont, err := truetype.Parse(gobold.TTF)
	if err == nil {
		nameSize := float64(wImg) * 0.05
		nameFace := truetype.NewFace(boldFont, &truetype.Options{Size: nameSize})
		dc.SetFontFace(nameFace)
		dc.SetHexColor("#2c2c2c")
		
		name := "The Ethnic Touch"
		
		// Draw name perfectly centered vertically in the banner
		// Since DrawString uses the baseline, adding 0.55 of bannerH visually centers it
		nameY := float64(hImg) + float64(bannerH)*0.55
		dc.DrawString(name, textStartX, nameY)
	}

	// 6. Serve the image
	w.Header().Set("Content-Type", "image/jpeg")
	w.Header().Set("Cache-Control", "public, max-age=86400")
	jpeg.Encode(w, dc.Image(), &jpeg.Options{Quality: 95})
}
