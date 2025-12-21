import { type initGame, type initGameResponse, initGameResponseSchema } from "@repo/schema";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { games, personalitys } from "../db/schema";

export async function createGame(
  gameData: initGame,
  db: DrizzleD1Database,
): Promise<initGameResponse> {
  try {
    const result = await db
      .insert(games)
      .values({
        player_id: gameData.player_id,
        enemy_id: gameData.enemy_id,
        first_player: gameData.first_player,
      })
      .returning();

    // game ID のみ取得
    const game_id = result[0].id;

    // Generate random personalitys for response
    const allPersonalitys = await db.select().from(personalitys).all();

    if (allPersonalitys.length == 0) {
      throw new Error("No personalitys found in database");
    }

    const randomPersonalitys = [];
    for (let i = 0; i < 32; i++) {
      randomPersonalitys[i] = allPersonalitys[Math.floor(Math.random() * allPersonalitys.length)];
    }

    const response = initGameResponseSchema.parse({
      game_id: game_id,
      personalitys: randomPersonalitys,
    });
    return response;
  } catch (error) {
    throw new Error(
      `Failed to create game: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
