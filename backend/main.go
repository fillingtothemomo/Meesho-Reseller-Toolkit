package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func main() {

	app := fiber.New()

	// checks here
	if _, err := os.Stat(DeploymentsDir); os.IsNotExist(err) {
		fmt.Println("Deployments directory does not exist, creating it")
		if err := os.MkdirAll(DeploymentsDir, 0755); err != nil {
			panic(err)
		}
	} else if err != nil {
		fmt.Println("Error checking deployments directory", err)
		panic(err)
	}
	// for mvp, we'd use this local serving, actual you should use a CDN. We don't have resources, meesho team - :crying_face_emoji:
	app.Static("/deployments", DeploymentsDir)

	// routes
	app.Post("/build", handleBuild)
	app.Get("/health", func(c *fiber.Ctx) error { return c.SendString("ok") })

	fmt.Println("Server running on :8080")
	if err := app.Listen(":8080"); err != nil {
		panic(err)
	}
}
