import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  UsersResponseSchema,
  VoiceInputRequestSchema,
  VoiceInputSuccessResponseSchema,
  VoiceInputErrorResponseSchema,
  ResolveActionInputSchema,
  initGameSchema,
  UserCreatedInputSchema,
} from "@repo/schema";
import { createGeminiClient } from "./lib/gemini";
import { transformVoiceInput } from "./lib/voice-input-transformer";
import { resolveAction } from "./lib/resolve-action";
import { drizzle } from "drizzle-orm/d1";
import { users } from "./db/schema";
import { createGame } from "./lib/create-game";

type Bindings = {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
  DB: D1Database;
};

// API routes
const api = new Hono<{ Bindings: Bindings }>()
  .get("/", async (c) => {
    const db = drizzle(c.env.DB);
    const result = await db.select().from(users).all();
    return Response.json(result);
  })
  .get("/users", (c) => {
    const response = { users };
    return c.json(UsersResponseSchema.parse(response));
  })
  .post("/v1/users", zValidator("json", UserCreatedInputSchema), async (c) => {
    const params = c.req.valid("json");
    const db = drizzle(c.env.DB);
    const uuid = self.crypto.randomUUID();
    await db.insert(users).values({ id: uuid, name: params.name });
    return c.json({ userId: uuid, success: true }, 201);
  })
  .post("/voice-input/transform", zValidator("json", VoiceInputRequestSchema), async (c) => {
    try {
      const { text } = c.req.valid("json");
      const apiKey = c.env.GEMINI_API_KEY;

      // Create Gemini client
      const client = createGeminiClient(apiKey);

      // Transform voice input using Gemini
      const transformedData = await transformVoiceInput(client, text);

      // Return success response with parsed data
      const response = VoiceInputSuccessResponseSchema.parse({
        success: true,
        data: transformedData,
      });

      return c.json(response, 200);
    } catch (error) {
      // Return error response
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const response = VoiceInputErrorResponseSchema.parse({
        success: false,
        error: errorMessage,
      });

      return c.json(response, 500);
    }
  })
  .get("/v1/health", (c) => {
    return c.json({ status: "ok" }, 200);
  })
  .post("/v1/resolveAction", zValidator("json", ResolveActionInputSchema), async (c) => {
    try {
      const input = c.req.valid("json");
      const result = await resolveAction(input);

      // TODO: 201
      return c.json(result, 200);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return c.json({ error: errorMessage }, 500);
    }
  })
  .post("/v1/createGame", zValidator("json", initGameSchema), async (c) => {
    try {
      const db = drizzle(c.env.DB);
      const gameData = c.req.valid("json");
      const result = await createGame(gameData, db);

      return c.json(result, 201);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return c.json({ error: errorMessage }, 500);
    }
  });

// Main app
const app = new Hono<{ Bindings: Bindings }>().route("/api", api).get("*", (c) => {
  // Serve static assets for all other routes
  return c.env.ASSETS.fetch(c.req.raw);
});

export type AppType = typeof api;

export default app;
