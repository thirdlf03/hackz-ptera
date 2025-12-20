import { sqliteTable, text, integer, check, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text().primaryKey(),
  name: text().notNull(),
});

export const games = sqliteTable(
  "games",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    player_id: text()
      .notNull()
      .references(() => users.id),
    enemy_id: text()
      .notNull()
      .references(() => users.id),
    first_player: text().notNull(),
    winner: text("winner").default(sql`NULL`),
  },
  (table) => [
    check(
      "first_player_check",
      sql`${table.first_player} IN (${table.player_id}, ${table.enemy_id})`,
    ),
    check(
      "winner_check",
      sql`${table.winner} IN ('player', 'enemy', 'draw') OR ${table.winner} IS NULL`,
    ),
  ],
);

export const personalitys = sqliteTable("personalitys", {
  id: integer().primaryKey(),
  obedience: real().notNull(),
  aggressiveness: real().notNull(),
  fear: real().notNull(),
  randomness: real().notNull(),
});
