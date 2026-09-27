package handlers

import (
	"encoding/xml"
	"fmt"
	"net/http"
	"strings"

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
	ChangeFreq string `xml:"changefreq,omitempty"`
	Priority   string `xml:"priority,omitempty"`
}

func (h *SitemapHandler) HandleSitemap(w http.ResponseWriter, r *http.Request) {
	baseURL := "https://theethnictouch.com"

	urlset := URLSet{
		URLs: []URL{
			{Loc: baseURL + "/", ChangeFreq: "daily", Priority: "1.0"},
			{Loc: baseURL + "/shop", ChangeFreq: "daily", Priority: "0.9"},
			{Loc: baseURL + "/about", ChangeFreq: "monthly", Priority: "0.8"},
			{Loc: baseURL + "/contact", ChangeFreq: "monthly", Priority: "0.7"},
			{Loc: baseURL + "/shop/straight-cut", ChangeFreq: "weekly", Priority: "0.8"},
			{Loc: baseURL + "/shop/anarkali", ChangeFreq: "weekly", Priority: "0.8"},
			{Loc: baseURL + "/shop/tunic", ChangeFreq: "weekly", Priority: "0.8"},
			{Loc: baseURL + "/shop/fusion", ChangeFreq: "weekly", Priority: "0.8"},
		},
	}

	products, _, err := h.ProductService.GetProducts(nil)
	if err == nil {
		for _, p := range products {
			// Create SEO Slug
			slug := strings.ToLower(strings.ReplaceAll(p.Name, " ", "-"))
			slug = strings.ReplaceAll(slug, "/", "-")
			loc := fmt.Sprintf("%s/product/%s/%s", baseURL, p.ID, slug)
			urlset.URLs = append(urlset.URLs, URL{
				Loc:        loc,
				ChangeFreq: "weekly",
				Priority:   "0.8",
			})
		}
	}

	w.Header().Set("Content-Type", "application/xml")
	w.Write([]byte(xml.Header))
	xml.NewEncoder(w).Encode(urlset)
}
