package main

import (
	"fmt"
	"os"
	"path/filepath"

)

// buildDeployment is the core logic, it is provided a deplyment folder with id and images.
// it then copies the static shell (index.html + assets) into outDir
func buildDeployment(outDir string, req BuildRequest, deployID string) (string, error) {
	
	// copy static shell's template dir contents (index.html + assets) into outDir
	staticShellDir := filepath.Join(StaticShellDir, req.TemplateID)
	entries, err := os.ReadDir(staticShellDir)
	if err != nil {
		os.RemoveAll(outDir)
		return "", fmt.Errorf("read static shell dir: %w", err)
	}
	for _, entry := range entries {
		srcPath := filepath.Join(staticShellDir, entry.Name())
		dstPath := filepath.Join(outDir, entry.Name())
		if entry.IsDir() {
			if err := copyDir(srcPath, dstPath); err != nil {
				os.RemoveAll(outDir)
				return "", fmt.Errorf("copy shell dir %s: %w", entry.Name(), err)
			}
		} else {
			if err := copyFile(srcPath, dstPath); err != nil {
				os.RemoveAll(outDir)
				return "", fmt.Errorf("copy shell file %s: %w", entry.Name(), err)
			}
		}
	}

	// handle images in here

	// write data.json
	dataPath := filepath.Join(outDir, "data.json")
	if err := writeJSONFile(dataPath, req.Data); err != nil {
		os.RemoveAll(outDir)
		return "", err
	}

	indexURL := fmt.Sprintf("/deployments/%s/index.html", deployID)

	return indexURL, nil
}
