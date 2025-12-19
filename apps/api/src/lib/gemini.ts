import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Creates and returns a Google Generative AI client instance.
 * This function acts as a factory for creating Gemini API clients.
 *
 * @param apiKey - The Gemini API key from environment variables
 * @returns GoogleGenerativeAI client instance
 * @throws Error if apiKey is not provided
 */
export function createGeminiClient(apiKey: string): GoogleGenerativeAI {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required to initialize Gemini client");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Gets a generative model instance from the Gemini client.
 * Defaults to gemini-2.0-flash-exp model if no model name is specified.
 *
 * @param client - The GoogleGenerativeAI client instance
 * @param modelName - The name of the model to use (default: "gemini-2.0-flash-exp")
 * @returns Generative model instance
 */
export function getGenerativeModel(client: GoogleGenerativeAI, modelName = "gemini-2.0-flash-exp") {
  return client.getGenerativeModel({ model: modelName });
}
