package main

import (
	"fmt"
	"os"
	"path/filepath"

)

// buildDeployment is the core logic, it is provided a deplyment folder with id and images.
// it then copies the static shell (index.html + assets) into outDir
func buildDeployment(outDir string, req BuildRequest, deployID string) (string, error) {
	
	// copy static shell (index.html + assets) into outDir
	if err := copyDir(StaticShellDir, outDir); err != nil {
		os.RemoveAll(outDir)
		return "", fmt.Errorf("copy shell: %w", err)
	}

	// write data.json
	dataPath := filepath.Join(outDir, "data.json")
	if err := writeJSONFile(dataPath, req.Data); err != nil {
		os.RemoveAll(outDir)
		return "", err
	}

	indexURL := fmt.Sprintf("/deployments/%s/index.html", deployID)

	return indexURL, nil
}
