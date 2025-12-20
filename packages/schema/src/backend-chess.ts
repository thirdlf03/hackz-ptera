import { z } from "zod";
import { personalitySchema } from "./personality";

// Schema for chess Personalities

export type ChessPersonality = z.infer<typeof personalitySchema>;

export const PieceStatesSchema = z.object({
  piece: z.enum(["pawn", "rook", "knight", "bishop", "queen", "king"]),
  personality: personalitySchema,
  position: z.string().regex(/[a-h][1-8]/),
  team: z.union([z.literal(0), z.literal(1)]),
});

export type PieceStates = z.infer<typeof PieceStatesSchema>;

export const boardStateSchema = z.object({
  board: z.array(PieceStatesSchema).length(32),
});
