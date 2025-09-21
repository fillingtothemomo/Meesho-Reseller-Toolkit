package main

import (
	// "encoding/json"
	"os"
	"fmt"
	"path/filepath"
	"strings"
	"github.com/google/uuid"

	"github.com/gofiber/fiber/v2"
)

// Prepare the deployment folder and images folder and finally call the buildDeployment function
func handleBuild(c *fiber.Ctx) error {
	ct := c.Get("Content-Type")
	var req BuildRequest
	
	// Create deployment unique id and folder
	deployID := uuid.New().String()[:12] // Hmm, maybe use hash based deployment id instead of uuid? - ashish :thinking_face_emoji: TODO_BACKLOG
	outDir := filepath.Join(DeploymentsDir, deployID)
	if err := os.MkdirAll(outDir, 0755); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed create deployment folder: "+err.Error())
	}

	// Save all images in outDir/images, but only create if it doesn't exist
	outImagesDir := filepath.Join(outDir, "images")
	if _, err := os.Stat(outImagesDir); os.IsNotExist(err) {
		if err := os.MkdirAll(outImagesDir, 0755); err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "failed create deployment images folder: "+err.Error())
		}
	} else if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to check deployment images folder: "+err.Error())
	}

	// Handle if images sent from fe, as in multipart/form-data
	if strings.HasPrefix(ct, "multipart/") {
		// TODO_ASHISH : Handle multipart, actual sending files
		// // Parse multipart form via net/http on the request
		// if err := c.Request().ParseMultipartForm(32 << 20); err != nil {
		// 	return fiber.NewError(fiber.StatusBadRequest, "failed parse multipart form: "+err.Error())
		// }
		// mf := c.Request().MultipartForm

		// // payload field required
		// payloadVals := mf.Value["payload"]
		// if len(payloadVals) == 0 {
		// 	return fiber.NewError(fiber.StatusBadRequest, "missing payload form field")
		// }
		// if err := json.Unmarshal([]byte(payloadVals[0]), &req); err != nil {
		// 	return fiber.NewError(fiber.StatusBadRequest, "invalid payload JSON: "+err.Error())
		// }

		// // save uploaded files
		// for partName, fhArr := range mf.File {
		// 	if partName == "payload" {
		// 		continue
		// 	}
		// 	if len(fhArr) == 0 {
		// 		continue
		// 	}
		// 	fh := fhArr[0]
		// 	tmpPath, err := saveUploadedFile(fh)
		// 	if err != nil {
		// 		// cleanup any saved tmp files
		// 		for _, p := range uploads {
		// 			os.Remove(p)
		// 		}
		// 		return fiber.NewError(fiber.StatusInternalServerError, "failed save upload "+partName+": "+err.Error())
		// 	}
		// 	uploads[partName] = tmpPath
		// }
	} else {
		// JSON body
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid json: "+err.Error())
		}

		fmt.Println("req", req)
	}

	// Validation checks
	if req.TemplateID == "" || req.Data == nil {
		return fiber.NewError(fiber.StatusBadRequest, "template_id and data are required")
	}

	// just check if the template exists
	templateDir := filepath.Join(StaticShellDir, req.TemplateID)
	if fi, err := os.Stat(templateDir); err != nil || !fi.IsDir() {
		cleanupDeployment(outDir)
		return fiber.NewError(fiber.StatusBadRequest, "template not found: "+req.TemplateID)
	}

	// Create deployment
	indexURL, err := buildDeployment(outDir, req, deployID)

	if err != nil {
		cleanupDeployment(outDir)
		return fiber.NewError(fiber.StatusInternalServerError, "build failed: "+err.Error())
	}

	resp := map[string]interface{}{
		"ok":            true,
		"deployment_id": deployID,
		"index":         "localhost:8080"+indexURL,
	}

	// resp := map[string]interface{}{
	// 	"ok": true,
	// 	"deployment_id": "123",
	// 	"index": "/deployments/123/index.html",
	// }

	return c.Status(200).JSON(resp)
}

