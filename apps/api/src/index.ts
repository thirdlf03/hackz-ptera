import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  CreateUserSchema,
  type User,
  UsersResponseSchema,
  UserCreatedResponseSchema,
  VoiceInputRequestSchema,
  VoiceInputSuccessResponseSchema,
  VoiceInputErrorResponseSchema,
} from "@repo/schema";
import { createGeminiClient } from "./lib/gemini";
import { transformVoiceInput } from "./lib/voice-input-transformer";

type Bindings = {
  ASSETS: Fetcher;
  GEMINI_API_KEY: string;
};

let users: User[] = [];

// API routes
const api = new Hono<{ Bindings: Bindings }>()
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get("/users", (c) => {
    const response = { users };
    return c.json(UsersResponseSchema.parse(response));
  })
  .post("/users", zValidator("json", CreateUserSchema), (c) => {
    const data = c.req.valid("json");
    const newUser: User = {
      id: crypto.randomUUID(),
      ...data,
    };
    users.push(newUser);
    const response = { message: "User created", user: newUser };
    return c.json(UserCreatedResponseSchema.parse(response), 201);
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
  });

// Main app
const app = new Hono<{ Bindings: Bindings }>().route("/api", api).get("*", (c) => {
  // Serve static assets for all other routes
  return c.env.ASSETS.fetch(c.req.raw);
});

export type AppType = typeof api;

export default app;
