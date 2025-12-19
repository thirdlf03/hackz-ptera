import { z } from "zod";

export const SixtyFourPositionSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  z: z.number().optional(),
});

export type Position = z.infer<typeof SixtyFourPositionSchema>;

export const PieceSchema = z.object({
  type: z.enum(["pawn", "rook", "knight", "bishop", "queen", "king"]),
  color: z.enum(["white", "black"]),
  position: SixtyFourPositionSchema,
});

export type Piece = z.infer<typeof PieceSchema>;
