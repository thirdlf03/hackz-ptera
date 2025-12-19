import { z } from "zod";

// Schema for normalized voice input
export const VoiceInputSchema = z.object({
  piece: z
    .string()
    .describe("駒の種類 (例: ポーン、ルーク、ナイト、ビショップ、クイーン、キング) または '全体'"),
  from: z.string().optional().describe("移動元の位置 (例: b5, a7)。指定がない場合は省略可能"),
  to: z.string().optional().describe("移動先の位置 (例: a7)。指定がない場合は省略可能"),
  order: z
    .string()
    .optional()
    .describe("駒への指示・命令 (例: がんばれ、前へ)。指定がない場合は省略可能"),
});

export type VoiceInput = z.infer<typeof VoiceInputSchema>;

// Response schemas using discriminated unions for type safety
export const VoiceInputSuccessResponseSchema = z.object({
  success: z.literal(true),
  data: VoiceInputSchema,
});

export const VoiceInputErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const VoiceInputResponseSchema = z.discriminatedUnion("success", [
  VoiceInputSuccessResponseSchema,
  VoiceInputErrorResponseSchema,
]);

export type VoiceInputResponse = z.infer<typeof VoiceInputResponseSchema>;
