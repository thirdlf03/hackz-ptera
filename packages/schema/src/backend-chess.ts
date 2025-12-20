import { z } from "zod";

// Schema for chess Personalities

export const ChessPersonalitySchema = z.object({
  obedience: z.number().min(0).max(1).describe("駒の指示に従う度合いを示す数値(0.0~1.0)"),
  aggressiveness: z.number().min(0).max(1).describe("攻撃的な動きをする度合いを示す数値(0.0~1.0)"),
  fear: z.number().min(0).max(1).describe("恐怖心の度合いを示す数値(0.0~1.0)"),
  randomness: z.number().min(0).max(1).describe("ランダムな動きをする度合いを示す数値(0.0~1.0)"),
});

export type ChessPersonality = z.infer<typeof ChessPersonalitySchema>;

export const PieceStatesSchema = z.object({
  piece: z.enum(["pawn", "rook", "knight", "bishop", "queen", "king"]),
  personality: ChessPersonalitySchema,
  position: z.string().regex(/[a-h][1-8]/),
  team: z.union([z.literal(0), z.literal(1)]),
});

export type PieceStates = z.infer<typeof PieceStatesSchema>;

export const boardStateSchema = z.object({
  board: z.array(PieceStatesSchema).length(32),
});
