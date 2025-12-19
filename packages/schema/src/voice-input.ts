import { z } from "zod";

// Schema for normalized voice input
export const VoiceInputSchema = z.object({
  piece: z
    .string()
    .describe("駒の種類 (例: ポーン、ルーク、ナイト、ビショップ、クイーン、キング) または '全体'"),
  from: z
    .string()
    .optional()
    .describe("移動元の位置 (例: b5, a7)。全体指示や to のみの場合は空文字列"),
  to: z.string().optional().describe("移動先の位置 (例: a7)。命令のみの場合は空文字列"),
  order: z.string().optional().describe("駒への指示・命令 (例: がんばれ、前へ)"),
});

export type VoiceInput = z.infer<typeof VoiceInputSchema>;

// Response schema when voice input is successfully normalized
export const VoiceInputResponseSchema = z.object({
  success: z.boolean(),
  data: VoiceInputSchema.optional(),
  error: z.string().optional(),
});

export type VoiceInputResponse = z.infer<typeof VoiceInputResponseSchema>;
