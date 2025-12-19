import type { GoogleGenerativeAI } from "@google/generative-ai";
import { SchemaType } from "@google/generative-ai";
import { VoiceInputSchema, type VoiceInput } from "@repo/schema";

/**
 * System prompt for Gemini to convert natural language voice input
 * into structured voice command data for chess piece control.
 */
const SYSTEM_PROMPT = `あなたはチェスの音声コマンドを構造化データに変換する専門家です。

ユーザーからの自然言語の音声入力を受け取り、以下の形式に変換してください：

- piece: 駒の種類（ポーン、ルーク、ナイト、ビショップ、クイーン、キング、または「全体」）
- from: 移動元の位置（例: b5, a7）。指定がない場合は省略
- to: 移動先の位置（例: a7）。指定がない場合は省略
- order: 駒への指示や命令（例: がんばれ、前へ）。指定がない場合は省略

入力例と出力例：
- 入力: "ポーンをb5からa7に移動して" → { piece: "ポーン", from: "b5", to: "a7" }
- 入力: "ナイト前へ" → { piece: "ナイト", order: "前へ" }
- 入力: "全体がんばれ" → { piece: "全体", order: "がんばれ" }

日本語、英語、その他の言語での入力に対応してください。`;

/**
 * Converts the Zod schema to Google Generative AI schema format
 */
function zodToGeminiSchema() {
  return {
    type: SchemaType.OBJECT,
    properties: {
      piece: {
        type: SchemaType.STRING,
        description:
          "駒の種類 (例: ポーン、ルーク、ナイト、ビショップ、クイーン、キング) または '全体'",
        nullable: false,
      },
      from: {
        type: SchemaType.STRING,
        description: "移動元の位置 (例: b5, a7)。指定がない場合は省略可能",
        nullable: true,
      },
      to: {
        type: SchemaType.STRING,
        description: "移動先の位置 (例: a7)。指定がない場合は省略可能",
        nullable: true,
      },
      order: {
        type: SchemaType.STRING,
        description: "駒への指示・命令 (例: がんばれ、前へ)。指定がない場合は省略可能",
        nullable: true,
      },
    },
    required: ["piece"],
  } as any;
}

/**
 * Transforms voice input text into structured VoiceInput data using Gemini's structured output.
 *
 * @param client - GoogleGenerativeAI client instance
 * @param inputText - Natural language voice input text
 * @param modelName - Optional model name (default: "gemini-2.0-flash-exp")
 * @returns Promise resolving to parsed VoiceInput data
 * @throws Error if the transformation fails or response parsing fails
 */
export async function transformVoiceInput(
  client: GoogleGenerativeAI,
  inputText: string,
  modelName = "gemini-2.0-flash-exp",
): Promise<VoiceInput> {
  try {
    // Get model with structured output configuration
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: zodToGeminiSchema(),
      },
    });

    // Generate content with system instruction
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: inputText }],
        },
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }],
      },
    });

    const response = result.response;
    const text = response.text();

    // Parse JSON response
    const jsonData = JSON.parse(text);

    // Validate and parse using Zod schema
    const parsedData = VoiceInputSchema.parse(jsonData);

    return parsedData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to transform voice input: ${error.message}`);
    }
    throw new Error("Failed to transform voice input: Unknown error");
  }
}
