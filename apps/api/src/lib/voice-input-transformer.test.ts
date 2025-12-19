import { describe, expect, it, vi, beforeEach } from "vitest";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { transformVoiceInput } from "./voice-input-transformer";

describe("Voice Input Transformer", () => {
  let mockClient: GoogleGenerativeAI;

  beforeEach(() => {
    mockClient = new GoogleGenerativeAI("test-api-key");
  });

  describe("transformVoiceInput", () => {
    it("should transform voice input with all fields", async () => {
      const mockResponse = {
        piece: "ポーン",
        from: "b5",
        to: "a7",
      };

      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      });

      const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      vi.spyOn(mockClient, "getGenerativeModel").mockImplementation(mockGetGenerativeModel);

      const result = await transformVoiceInput(mockClient, "ポーンをb5からa7に移動して");

      expect(result).toEqual({
        piece: "ポーン",
        from: "b5",
        to: "a7",
      });

      expect(mockGetGenerativeModel).toHaveBeenCalledWith({
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: expect.objectContaining({
            type: "object",
            properties: expect.any(Object),
            required: ["piece"],
          }),
        },
      });

      expect(mockGenerateContent).toHaveBeenCalledWith({
        contents: [
          {
            role: "user",
            parts: [{ text: "ポーンをb5からa7に移動して" }],
          },
        ],
        systemInstruction: {
          role: "system",
          parts: [{ text: expect.stringContaining("チェスの音声コマンド") }],
        },
      });
    });

    it("should transform voice input with only piece", async () => {
      const mockResponse = {
        piece: "ナイト",
      };

      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      });

      vi.spyOn(mockClient, "getGenerativeModel").mockReturnValue({
        generateContent: mockGenerateContent,
      } as any);

      const result = await transformVoiceInput(mockClient, "ナイト");

      expect(result).toEqual({
        piece: "ナイト",
      });
    });

    it("should transform voice input with piece and order", async () => {
      const mockResponse = {
        piece: "全体",
        order: "がんばれ",
      };

      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      });

      vi.spyOn(mockClient, "getGenerativeModel").mockReturnValue({
        generateContent: mockGenerateContent,
      } as any);

      const result = await transformVoiceInput(mockClient, "全体がんばれ");

      expect(result).toEqual({
        piece: "全体",
        order: "がんばれ",
      });
    });

    it("should use custom model name when provided", async () => {
      const mockResponse = {
        piece: "クイーン",
      };

      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      });

      const mockGetGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      });

      vi.spyOn(mockClient, "getGenerativeModel").mockImplementation(mockGetGenerativeModel);

      await transformVoiceInput(mockClient, "クイーン", "gemini-1.5-pro");

      expect(mockGetGenerativeModel).toHaveBeenCalledWith(
        expect.objectContaining({
          model: "gemini-1.5-pro",
        }),
      );
    });

    it("should throw error when response is invalid JSON", async () => {
      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => "invalid json",
        },
      });

      vi.spyOn(mockClient, "getGenerativeModel").mockReturnValue({
        generateContent: mockGenerateContent,
      } as any);

      await expect(transformVoiceInput(mockClient, "test")).rejects.toThrow(
        "Failed to transform voice input",
      );
    });

    it("should throw error when Zod validation fails", async () => {
      // Missing required 'piece' field
      const mockResponse = {
        from: "a1",
        to: "a2",
      };

      const mockGenerateContent = vi.fn().mockResolvedValue({
        response: {
          text: () => JSON.stringify(mockResponse),
        },
      });

      vi.spyOn(mockClient, "getGenerativeModel").mockReturnValue({
        generateContent: mockGenerateContent,
      } as any);

      await expect(transformVoiceInput(mockClient, "test")).rejects.toThrow(
        "Failed to transform voice input",
      );
    });

    it("should throw error when Gemini API fails", async () => {
      const mockGenerateContent = vi.fn().mockRejectedValue(new Error("API Error"));

      vi.spyOn(mockClient, "getGenerativeModel").mockReturnValue({
        generateContent: mockGenerateContent,
      } as any);

      await expect(transformVoiceInput(mockClient, "test")).rejects.toThrow(
        "Failed to transform voice input: API Error",
      );
    });

    it("should throw error with generic message for non-Error exceptions", async () => {
      const mockGenerateContent = vi.fn().mockRejectedValue("string error");

      vi.spyOn(mockClient, "getGenerativeModel").mockReturnValue({
        generateContent: mockGenerateContent,
      } as any);

      await expect(transformVoiceInput(mockClient, "test")).rejects.toThrow(
        "Failed to transform voice input: Unknown error",
      );
    });
  });
});
