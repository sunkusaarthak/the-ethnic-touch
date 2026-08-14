//go:build ignore

package main

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"
)

func main() {
	cloudName := "llhqdiv6"
	apiKey := "225189116265726"
	apiSecret := "-RX9TF9AZ5j7TBRrzgYHe71fStU"

	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	
	sigStr := fmt.Sprintf("timestamp=%s%s", timestamp, apiSecret)
	hasher := sha1.New()
	hasher.Write([]byte(sigStr))
	signature := hex.EncodeToString(hasher.Sum(nil))

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	part, _ := writer.CreateFormFile("file", "test.jpg")
	part.Write([]byte("fake image content"))

	writer.WriteField("api_key", apiKey)
	writer.WriteField("timestamp", timestamp)
	writer.WriteField("signature", signature)
	writer.Close()

	url := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", cloudName)
	req, _ := http.NewRequest("POST", url, body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	respBytes, _ := io.ReadAll(resp.Body)
	fmt.Printf("Status: %d\nResponse: %s\n", resp.StatusCode, string(respBytes))
}
