import { z } from "zod";
import { personalitySchema } from "./personality";

export const initGameSchema = z.object({
  player_id: z.uuid(),
  enemy_id: z.uuid(),
  first_player: z.uuid(),
});

export type initGame = z.infer<typeof initGameSchema>;

export const initGameResponseSchema = z.object({
  game_id: z.number().int(),
  personalitys: z.array(personalitySchema).length(32),
});

export type initGameResponse = z.infer<typeof initGameResponseSchema>;
