import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUser = z.infer<typeof CreateUserSchema>;

export const UserCreatedInputSchema = z.object({
  name: z.string().min(2),
});
export type UserCreatedInput = z.infer<typeof UserCreatedInputSchema>;

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
});

export const UserCreatedResponseSchema = z.object({
  userId: z.uuid(),
  success: z.boolean(),
});

export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export type UserCreatedResponse = z.infer<typeof UserCreatedResponseSchema>;
