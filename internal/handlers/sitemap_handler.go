package handlers

import (
	"encoding/xml"
	"fmt"
	"net/http"
	"regexp"
	"strings"
	"time"

	"ethnictouch/internal/service"
)

type SitemapHandler struct {
	ProductService service.ProductService
}

func NewSitemapHandler(productService service.ProductService) *SitemapHandler {
	return &SitemapHandler{ProductService: productService}
}

// XML Sitemap Structures
type URLSet struct {
	XMLName xml.Name `xml:"http://www.sitemaps.org/schemas/sitemap/0.9 urlset"`
	URLs    []URL    `xml:"url"`
}

type URL struct {
	Loc        string `xml:"loc"`
	LastMod    string `xml:"lastmod,omitempty"`
	ChangeFreq string `xml:"changefreq,omitempty"`
	Priority   string `xml:"priority,omitempty"`
}

var (
	reNonAlpha    = regexp.MustCompile(`[^a-z0-9\-]+`)
	reMultiHyphen = regexp.MustCompile(`-+`)
)

func createSlug(name string) string {
	s := strings.ToLower(name)
	s = strings.ReplaceAll(s, "&", "and")
	s = strings.ReplaceAll(s, "/", "-")
	s = strings.ReplaceAll(s, "\\", "-")
	s = strings.ReplaceAll(s, "+", "-")
	s = reNonAlpha.ReplaceAllString(s, "-")
	s = reMultiHyphen.ReplaceAllString(s, "-")
	return strings.Trim(s, "-")
}

func (h *SitemapHandler) HandleSitemap(w http.ResponseWriter, r *http.Request) {
	baseURL := "https://www.theethnictouch.com"
	today := time.Now().Format("2006-01-02")

	urlset := URLSet{
		URLs: []URL{
			{Loc: baseURL + "/", LastMod: today, ChangeFreq: "daily", Priority: "1.0"},
			{Loc: baseURL + "/shop", LastMod: today, ChangeFreq: "daily", Priority: "0.95"},
			{Loc: baseURL + "/shop/straight-cut", LastMod: today, ChangeFreq: "weekly", Priority: "0.85"},
			{Loc: baseURL + "/shop/anarkali", LastMod: today, ChangeFreq: "weekly", Priority: "0.85"},
			{Loc: baseURL + "/shop/tunic", LastMod: today, ChangeFreq: "weekly", Priority: "0.85"},
			{Loc: baseURL + "/shop/fusion", LastMod: today, ChangeFreq: "weekly", Priority: "0.85"},
			{Loc: baseURL + "/about", LastMod: today, ChangeFreq: "monthly", Priority: "0.7"},
			{Loc: baseURL + "/contact", LastMod: today, ChangeFreq: "monthly", Priority: "0.7"},
			{Loc: baseURL + "/privacy-policy", LastMod: today, ChangeFreq: "yearly", Priority: "0.3"},
			{Loc: baseURL + "/refund-policy", LastMod: today, ChangeFreq: "yearly", Priority: "0.3"},
		},
	}

	products, _, err := h.ProductService.GetProducts(nil)
	if err == nil {
		for _, p := range products {
			slug := createSlug(p.Name)
			loc := fmt.Sprintf("%s/product/%s/%s", baseURL, p.ID, slug)
			urlset.URLs = append(urlset.URLs, URL{
				Loc:        loc,
				LastMod:    today,
				ChangeFreq: "weekly",
				Priority:   "0.8",
			})
		}
	}

	w.Header().Set("Content-Type", "application/xml")
	w.Write([]byte(xml.Header))
	xml.NewEncoder(w).Encode(urlset)
}
