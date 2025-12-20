import { z } from "zod";
import { PieceSchema } from "./chess";

/**
 * Schema for resolving chess actions from user commands
 * Input: { from: "g4", to: "f6", order: "命令" }
 */
export const ResolveActionInputSchema = z.object({
  pieces: z.array(PieceSchema),
  from: z.string().regex(/^[a-h][1-8]$/, "Must be a valid chess position (e.g., 'g4')"),
  to: z.string().regex(/^[a-h][1-8]$/, "Must be a valid chess position (e.g., 'f6')"),
  order: z.string(),
});

export type ResolveActionInput = z.infer<typeof ResolveActionInputSchema>;
