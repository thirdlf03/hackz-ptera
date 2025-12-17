import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2),
  email: z.email(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
});

export const UserCreatedResponseSchema = z.object({
  message: z.string(),
  user: UserSchema,
});

export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export type UserCreatedResponse = z.infer<typeof UserCreatedResponseSchema>;
