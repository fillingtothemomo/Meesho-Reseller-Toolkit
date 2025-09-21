package main

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"encoding/json"
)

// Paths/config - tweak if needed
const (
	StaticShellDir = "static-shell"
	DeploymentsDir = "deployments"
)

func cleanupDeployment(outDir string) {
	os.RemoveAll(outDir)
}

// saveUploadedFile writes uploaded multipart.FileHeader to a temp file and returns path
func saveUploadedFile(fh *multipart.FileHeader) (string, error) {
	src, err := fh.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	ext := filepath.Ext(fh.Filename)
	if ext == "" {
		ext = ".bin"
	}
	name := randHex(10) + ext
	tmp := filepath.Join(os.TempDir(), name)

	out, err := os.Create(tmp)
	if err != nil {
		return "", err
	}
	defer out.Close()

	lr := io.LimitReader(src, MaxImageBytes+1)
	n, err := io.Copy(out, lr)
	if err != nil {
		os.Remove(tmp)
		return "", err
	}
	if n > MaxImageBytes {
		os.Remove(tmp)
		return "", errors.New("uploaded file too large")
	}
	return tmp, nil
}

// processGalleryImages mutates data["gallery"] -> sets item["url"] = "./images/<name>"
func processGalleryImages(templateDir, outImagesDir string, uploads map[string]string, data map[string]interface{}) error {
	gRaw, ok := data["gallery"]
	if !ok {
		// nothing to do
		return nil
	}
	gArr, ok := gRaw.([]interface{})
	if !ok {
		return errors.New("gallery field must be an array")
	}

	for i, gi := range gArr {
		item, ok := gi.(map[string]interface{})
		if !ok {
			continue
		}

		// 1) uploaded file reference
		if ref, ok := item["upload_ref"].(string); ok && ref != "" {
			if pathTmp, found := uploads[ref]; found {
				name := randNameWithExt(pathTmp)
				dst := filepath.Join(outImagesDir, name)
				if err := copyFile(pathTmp, dst); err != nil {
					return err
				}
				item["url"] = "./images/" + name
				// remove tmp
				os.Remove(pathTmp)
				gArr[i] = item
				continue
			}
		}

		// 2) url field
		if rawURL, ok := item["url"].(string); ok && rawURL != "" {
			rawURL = strings.TrimSpace(rawURL)
			if strings.HasPrefix(rawURL, "http://") || strings.HasPrefix(rawURL, "https://") {
				name, err := downloadImage(rawURL, outImagesDir)
				if err != nil {
					return err
				}
				item["url"] = "./images/" + name
				gArr[i] = item
				continue
			} else {
				rel := strings.TrimPrefix(rawURL, "/")
				src := filepath.Join(templateDir, rel)
				if exists(src) {
					name := filepath.Base(src)
					dst := filepath.Join(outImagesDir, name)
					if err := copyFile(src, dst); err != nil {
						return err
					}
					item["url"] = "./images/" + name
					gArr[i] = item
					continue
				} else {
					// if desired, skip or error. Here we error to surface missing template images.
					return errors.New("template-local image not found: " + rawURL)
				}
			}
		}
	}

	data["gallery"] = gArr
	return nil
}

func writeJSONFile(p string, v interface{}) error {
	f, err := os.Create(p)
	if err != nil {
		return err
	}
	defer f.Close()
	enc := json.NewEncoder(f)
	enc.SetIndent("", "  ")
	return enc.Encode(v)
}

func copyDirIfExists(src, dst string) error {
	if exists(src) {
		return copyDir(src, dst)
	}
	return nil
}

func copyDir(src, dst string) error {
	return filepath.Walk(src, func(p string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		rel, _ := filepath.Rel(src, p)
		target := filepath.Join(dst, rel)
		if info.IsDir() {
			return os.MkdirAll(target, 0755)
		}
		if err := os.MkdirAll(filepath.Dir(target), 0755); err != nil {
			return err
		}
		return copyFile(p, target)
	})
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()
	if _, err := io.Copy(out, in); err != nil {
		return err
	}
	return out.Sync()
}

func exists(p string) bool {
	_, err := os.Stat(p)
	return err == nil
}

func randHex(n int) string {
	b := make([]byte, n)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func randNameWithExt(srcPath string) string {
	ext := filepath.Ext(srcPath)
	if ext == "" {
		ext = ".jpg"
	}
	return randHex(10) + ext
}

func guessExtFromContentType(ct string) string {
	ct = strings.ToLower(ct)
	switch {
	case strings.Contains(ct, "jpeg"):
		return ".jpg"
	case strings.Contains(ct, "png"):
		return ".png"
	case strings.Contains(ct, "gif"):
		return ".gif"
	case strings.Contains(ct, "webp"):
		return ".webp"
	case strings.Contains(ct, "svg"):
		return ".svg"
	default:
		return ""
	}
}
