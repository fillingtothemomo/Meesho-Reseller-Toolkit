package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const (
	MaxImageBytes   = 10 * 1024 * 1024 // 10MB per image
	DownloadTimeout = 15 * time.Second
)

// downloadImage downloads URL into outImagesDir and returns the filename (not path).
func downloadImage(url string, outImagesDir string) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DownloadTimeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "templater/1.0")

	client := &http.Client{Timeout: DownloadTimeout}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("bad status %d", resp.StatusCode)
	}

	ct := resp.Header.Get("Content-Type")
	if ct == "" || !strings.HasPrefix(ct, "image/") {
		return "", fmt.Errorf("content-type not image: %s", ct)
	}

	ext := guessExtFromContentType(ct)
	if ext == "" {
		ext = filepath.Ext(resp.Request.URL.Path)
		if ext == "" {
			ext = ".jpg"
		}
	}

	name := randHex(12) + ext
	dst := filepath.Join(outImagesDir, name)

	limited := io.LimitReader(resp.Body, MaxImageBytes+1)
	out, err := os.Create(dst)
	if err != nil {
		return "", err
	}
	defer out.Close()

	n, err := io.Copy(out, limited)
	if err != nil {
		os.Remove(dst)
		return "", err
	}
	if n > MaxImageBytes {
		os.Remove(dst)
		return "", errors.New("downloaded image too large")
	}
	return name, nil
}
