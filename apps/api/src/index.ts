import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  CreateUserSchema,
  type User,
  UsersResponseSchema,
  UserCreatedResponseSchema,
} from "@repo/schema";

let users: User[] = [];

const app = new Hono()
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

export type AppType = typeof app;

export default app;
