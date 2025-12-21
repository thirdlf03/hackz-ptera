import { z } from "zod";

export const chessLogSchema = z.object({
  game_id: z.number(),
  from: z.string().regex(/^[a-h][1-8]$/),
  to: z.string().regex(/^[a-h][1-8]$/),
  attack: z
    .union([z.boolean(), z.number()])
    .transform((val) => (typeof val === "boolean" ? (val ? 1 : 0) : val)),
  reason: z.string(),
});

export type ChessLog = z.infer<typeof chessLogSchema>;
