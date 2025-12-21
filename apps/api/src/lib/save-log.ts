import { chessLogSchema, type ChessLog } from "@repo/schema";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { logs } from "../db/schema";

export async function saveLog(logData: ChessLog, db: DrizzleD1Database): Promise<ChessLog> {
  try {
    const result = await db
      .insert(logs)
      .values({
        game_id: logData.game_id,
        from: logData.from,
        to: logData.to,
        attack: logData.attack,
        reason: logData.reason,
      })
      .returning();

    const savedLog = chessLogSchema.parse(result[0]);
    return savedLog;
  } catch (error) {
    throw new Error(
      `Failed to save log: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
