# ai-chat-example Server Backend

A Go project to retrieve the RAG context, and augment the prompt before passing it to the LLM.

## How to run
1. Install the go modules `go mod download`
2. Export your OpenAPI API key: `export OPENAI_API_KEY="$(pbpaste)"`
2. Run the server: `go run .`
