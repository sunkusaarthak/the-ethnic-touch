package main

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
)

func main() {
	url := "https://www.instagram.com/theethnictouch.co/reel/DejumS8Cwm2/"
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.html)")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Printf("err: %v\n", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	bodyStr := string(body)

	// Check og:video
	reVideo := regexp.MustCompile(`(?i)<meta\s+[^>]*property=["']og:video[^"']*["'][^>]*content=["']([^"']+)["']`)
	matches := reVideo.FindAllStringSubmatch(bodyStr, -1)
	fmt.Printf("og:video matches: %d\n", len(matches))
	for _, m := range matches {
		fmt.Printf("Video URL: %s\n", m[1])
	}

	// Check any mp4 in the HTML
	reMp4 := regexp.MustCompile(`https://[^"'\s\\]+\.mp4[^"'\s\\]*`)
	mp4Matches := reMp4.FindAllString(bodyStr, -1)
	fmt.Printf("mp4 matches: %d\n", len(mp4Matches))
	for _, m := range mp4Matches {
		fmt.Printf("MP4 URL: %s\n", m)
	}
}
