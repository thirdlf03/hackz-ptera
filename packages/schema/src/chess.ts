import { z } from "zod";
import { personalitySchema }from "./personality"
export const SixtyFourPositionSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  z: z.number().optional(),
});

export type Position = z.infer<typeof SixtyFourPositionSchema>;

export const PieceSchema = z.object({
  id: z.int().min(0).max(31),
  exist: z.boolean().default(true),
  type: z.enum(["pawn", "rook", "knight", "bishop", "queen", "king"]),
  color: z.enum(["white", "black"]),
  position: SixtyFourPositionSchema,
  personality: personalitySchema,
});

export type Piece = z.infer<typeof PieceSchema>;
