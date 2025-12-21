import { z } from "zod";

export const RecodeWinnerSchema = z.object({
  game_id: z.number(),
  winner: z.enum(["player", "enemy", "draw"]).nullable(),
});
