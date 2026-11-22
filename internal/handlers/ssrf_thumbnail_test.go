package handlers

import (
	"bytes"
	"io"
	"net"
	"net/http"
	"strings"
	"testing"
)

type mockTransport struct {
	roundTripFunc func(req *http.Request) (*http.Response, error)
}

func (m *mockTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	return m.roundTripFunc(req)
}

func TestFetchAndSaveInstaThumbnail_SecurityEnforcement(t *testing.T) {
	// 1. Rejects non-HTTPS schemes
	_, _, err := fetchAndSaveInstaThumbnail("http://www.instagram.com/reel/C12345/")
	if err == nil || !strings.Contains(err.Error(), "only https is permitted") {
		t.Fatalf("expected non-https scheme rejection, got: %v", err)
	}

	// 2. Rejects unapproved domains (SSRF targeting internal network or arbitrary domains)
	_, _, err = fetchAndSaveInstaThumbnail("https://evil.internal.service/reel/C12345/")
	if err == nil || !strings.Contains(err.Error(), "only official instagram hosts permitted") {
		t.Fatalf("expected disallowed host rejection, got: %v", err)
	}

	// 3. Rejects loopback / cloud metadata IP resolutions (127.0.0.1, 169.254.169.254)
	origLookup := instaLookupIP
	defer func() { instaLookupIP = origLookup }()
	instaLookupIP = func(host string) ([]net.IP, error) {
		return []net.IP{net.ParseIP("169.254.169.254")}, nil
	}

	_, _, err = fetchAndSaveInstaThumbnail("https://www.instagram.com/reel/C12345/")
	if err == nil || !strings.Contains(err.Error(), "prohibited host resolution") {
		t.Fatalf("expected cloud metadata IP rejection, got: %v", err)
	}

	// Reset IP lookup to safe public IP
	instaLookupIP = func(host string) ([]net.IP, error) {
		return []net.IP{net.ParseIP("157.240.22.174")}, nil
	}

	// 4. Enforce 5MB limit on downloaded image data
	origTransport := instaHTTPTransport
	defer func() { instaHTTPTransport = origTransport }()

	instaHTTPTransport = &mockTransport{
		roundTripFunc: func(req *http.Request) (*http.Response, error) {
			if !strings.HasSuffix(req.URL.Path, ".jpg") {
				// Return HTML containing og:image meta tag pointing to allowed CDN
				htmlBody := `<html><head><meta property="og:image" content="https://scontent.cdninstagram.com/v/test.jpg" /></head></html>`
				return &http.Response{
					StatusCode: 200,
					Body:       io.NopCloser(strings.NewReader(htmlBody)),
					Header:     make(http.Header),
				}, nil
			}
			// Image download: Oversized payload (> 5MB)
			oversized := bytes.Repeat([]byte{0xFF, 0xD8, 0xFF, 0xE0}, (6<<20)/4) // 6MB
			return &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(bytes.NewReader(oversized)),
				Header:     http.Header{"Content-Type": []string{"image/jpeg"}},
			}, nil
		},
	}

	_, _, err = fetchAndSaveInstaThumbnail("https://www.instagram.com/reel/C12345/")
	if err == nil || !strings.Contains(err.Error(), "exceeds 5MB limit") {
		t.Fatalf("expected oversized image rejection (>5MB), got: %v", err)
	}

	// 5. Enforce Image MIME Verification (reject executable/HTML disguised as image)
	instaHTTPTransport = &mockTransport{
		roundTripFunc: func(req *http.Request) (*http.Response, error) {
			if !strings.HasSuffix(req.URL.Path, ".jpg") {
				htmlBody := `<html><head><meta property="og:image" content="https://scontent.cdninstagram.com/v/fake.jpg" /></head></html>`
				return &http.Response{
					StatusCode: 200,
					Body:       io.NopCloser(strings.NewReader(htmlBody)),
					Header:     make(http.Header),
				}, nil
			}
			// Return HTML/Script pretending to be image
			scriptPayload := `<script>alert('xss')</script>`
			return &http.Response{
				StatusCode: 200,
				Body:       io.NopCloser(strings.NewReader(scriptPayload)),
				Header:     http.Header{"Content-Type": []string{"text/html"}},
			}, nil
		},
	}

	_, _, err = fetchAndSaveInstaThumbnail("https://www.instagram.com/reel/C12345/")
	if err == nil || !strings.Contains(err.Error(), "not a valid image format") {
		t.Fatalf("expected non-image MIME rejection, got: %v", err)
	}
}
