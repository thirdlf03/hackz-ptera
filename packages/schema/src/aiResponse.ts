import { z } from "zod";

export const AIResponseSchema = z.object({
  "from": z.string().regex(/^[a-h][1-8]$/),
  "to": z.string().regex(/^[a-h][1-8]$/),
  attack: z.boolean(),
  reason: z.string()
});

export type AIResponse = z.infer<typeof AIResponseSchema>;
