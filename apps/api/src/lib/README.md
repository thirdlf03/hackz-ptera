# Gemini API Integration

This directory contains the Google Generative AI (Gemini) client setup for the API.

## Setup

### 1. Install Dependencies

The `@google/generative-ai` package is already included in the project dependencies.

### 2. Configure API Key

#### For Local Development

Create a `.dev.vars` file in the `apps/api` directory:

```bash
cp .dev.vars.example .dev.vars
```

Then add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

#### For Production Deployment

Set the secret using Wrangler CLI:

```bash
wrangler secret put GEMINI_API_KEY
```

## Usage

### Basic Example

```typescript
import { createGeminiClient, getGenerativeModel } from "./lib/gemini";

// In your Hono route handler
app.get("/generate", async (c) => {
  // Get API key from environment
  const apiKey = c.env.GEMINI_API_KEY;

  // Create client
  const client = createGeminiClient(apiKey);

  // Get model (defaults to gemini-2.0-flash-exp)
  const model = getGenerativeModel(client);

  // Generate content
  const result = await model.generateContent("Tell me a joke");
  const response = await result.response;
  const text = response.text();

  return c.json({ text });
});
```

### Custom Model

```typescript
// Use a different model
const model = getGenerativeModel(client, "gemini-pro");
```

## API Reference

### `createGeminiClient(apiKey: string): GoogleGenerativeAI`

Creates a new Google Generative AI client instance.

- **Parameters:**
  - `apiKey` (string): Your Gemini API key
- **Returns:** GoogleGenerativeAI client instance
- **Throws:** Error if apiKey is empty or undefined

### `getGenerativeModel(client: GoogleGenerativeAI, modelName?: string)`

Gets a generative model instance from the client.

- **Parameters:**
  - `client` (GoogleGenerativeAI): The client instance
  - `modelName` (string, optional): Model name (default: "gemini-2.0-flash-exp")
- **Returns:** Generative model instance

## Available Models

- `gemini-2.0-flash-exp` (default) - Latest experimental flash model (Gemini 2.0 Flash)
- `gemini-1.5-flash` - Fast and efficient for most tasks
- `gemini-1.5-pro` - More capable for complex tasks
- `gemini-pro` - Previous generation model

See [Google's documentation](https://ai.google.dev/models/gemini) for the latest model information.
