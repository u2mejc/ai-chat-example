package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sashabaranov/go-openai"
)

type ChatRequest struct {
	Message   string `json:"message"`
	PageTitle string `json:"pageTitle"`
	URL       string `json:"url"`
}

type ChatResponse struct {
	Reply string `json:"reply"`
}

func main() {
	r := gin.Default()

	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.POST("/api/chat", handleChat)
	r.Run(":8080")
}

func handleChat(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Debug logging
	fmt.Printf("Received chat request: %+v\n", req)

	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))
	ctx := context.Background()

	prompt := fmt.Sprintf(`You are a helpful and friendly assistant.
The page the user is on is titled: "%s".
They said: "%s".
Please respond conversationally.`, req.PageTitle, req.Message)

	resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: "gpt-4.1-nano",
		Messages: []openai.ChatCompletionMessage{
			{Role: openai.ChatMessageRoleSystem, Content: "You are a friendly and helpful assistant."},
			{Role: openai.ChatMessageRoleUser, Content: prompt},
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	reply := resp.Choices[0].Message.Content
	c.JSON(http.StatusOK, ChatResponse{Reply: reply})
}