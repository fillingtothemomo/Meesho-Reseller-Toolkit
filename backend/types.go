package main

// BuildRequest is the expected JSON payload (or the payload field in multipart)
type BuildRequest struct {
	TemplateID string                 `json:"template_id"`
	Data       map[string]interface{} `json:"data"`
}
