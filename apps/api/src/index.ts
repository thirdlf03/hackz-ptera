import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  CreateUserSchema,
  type User,
  UsersResponseSchema,
  UserCreatedResponseSchema,
} from "@repo/schema";

type Bindings = {
  ASSETS: Fetcher;
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
  });

// Main app
const app = new Hono<{ Bindings: Bindings }>().route("/api", api).get("*", (c) => {
  // Serve static assets for all other routes
  return c.env.ASSETS.fetch(c.req.raw);
});

export type AppType = typeof api;

export default app;
