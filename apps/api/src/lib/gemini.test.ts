import { describe, expect, it } from "vitest";
import { createGeminiClient, getGenerativeModel } from "./gemini";

describe("Gemini Client", () => {
  describe("createGeminiClient", () => {
    it("should create a client with valid API key", () => {
      const client = createGeminiClient("test-api-key");
      expect(client).toBeDefined();
    });

    it("should throw error when API key is empty", () => {
      expect(() => createGeminiClient("")).toThrow(
        "GEMINI_API_KEY is required to initialize Gemini client",
      );
    });
  });

  describe("getGenerativeModel", () => {
    it("should get a model with default model name", () => {
      const client = createGeminiClient("test-api-key");
      const model = getGenerativeModel(client);
      expect(model).toBeDefined();
    });

    it("should get a model with custom model name", () => {
      const client = createGeminiClient("test-api-key");
      const model = getGenerativeModel(client, "gemini-pro");
      expect(model).toBeDefined();
    });
  });
});
