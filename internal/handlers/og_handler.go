package handlers

import (
	"fmt"
	"image"
	"image/color"
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
	"golang.org/x/image/font/gofont/goregular"
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

	// 2. Set up the OG Canvas (1200x630)
	dc := gg.NewContext(1200, 630)
	dc.SetHexColor("#faf7f2") // Premium soft cream background
	dc.Clear()

	// 3. Resize and draw product image on the right side
	// We want the image to fill the height (630px)
	origH := float64(img.Bounds().Dy())
	origW := float64(img.Bounds().Dx())
	newW := int(origW * (630.0 / origH))
	
	scaledImg := image.NewRGBA(image.Rect(0, 0, newW, 630))
	draw.ApproxBiLinear.Scale(scaledImg, scaledImg.Bounds(), img, img.Bounds(), draw.Over, nil)
	
	// Place image on the right side. If it's wider than 600px, it will overlap the left, which is fine, 
	// but let's align it to the right edge.
	xPos := 1200 - newW
	if xPos < 400 { xPos = 500 } // Minimum left margin for text
	dc.DrawImage(scaledImg, xPos, 0)

	// Add a subtle drop shadow/fade effect on the left edge of the image
	grad := gg.NewLinearGradient(float64(xPos), 0, float64(xPos+100), 0)
	grad.AddColorStop(0, color.RGBA{R: 250, G: 247, B: 242, A: 255})
	grad.AddColorStop(1, color.RGBA{R: 250, G: 247, B: 242, A: 0})
	dc.SetFillStyle(grad)
	dc.DrawRectangle(float64(xPos), 0, 100, 630)
	dc.Fill()

	// 4. Resize and draw brand logo in the top left
	logoPath := filepath.Join("frontend", "public", "navbar-logo.png")
	logoImg, err := gg.LoadImage(logoPath)
	if err == nil {
		lH := float64(logoImg.Bounds().Dy())
		lW := float64(logoImg.Bounds().Dx())
		newLH := 60.0
		newLW := int(lW * (newLH / lH))
		
		scaledLogo := image.NewRGBA(image.Rect(0, 0, newLW, int(newLH)))
		draw.ApproxBiLinear.Scale(scaledLogo, scaledLogo.Bounds(), logoImg, logoImg.Bounds(), draw.Over, nil)
		dc.DrawImage(scaledLogo, 60, 50)
	}

	// 5. Draw Typography (Name and Price) using embedded fonts so it works on Linux/Render
	boldFont, err := truetype.Parse(gobold.TTF)
	if err == nil {
		face := truetype.NewFace(boldFont, &truetype.Options{Size: 52})
		dc.SetFontFace(face)
		dc.SetHexColor("#2c2c2c")
		dc.DrawStringWrapped(product.Name, 60, 220, 0, 0, float64(xPos-80), 1.3, gg.AlignLeft)
	}

	regFont, err := truetype.Parse(goregular.TTF)
	if err == nil {
		// Draw Price
		priceFace := truetype.NewFace(regFont, &truetype.Options{Size: 38})
		dc.SetFontFace(priceFace)
		dc.SetHexColor("#9c6c40")
		dc.DrawString(fmt.Sprintf("Rs. %s", fmt.Sprintf("%.0f", product.Price)), 60, 420)
		
		// Draw Website URL at the bottom left
		urlFace := truetype.NewFace(regFont, &truetype.Options{Size: 24})
		dc.SetFontFace(urlFace)
		dc.SetHexColor("#888888")
		dc.DrawString("theethnictouch.com", 60, 560)
	}

	// 6. Serve the image
	w.Header().Set("Content-Type", "image/jpeg")
	w.Header().Set("Cache-Control", "public, max-age=86400")
	jpeg.Encode(w, dc.Image(), &jpeg.Options{Quality: 95})
}
