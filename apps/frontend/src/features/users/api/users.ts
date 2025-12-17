import { client } from "@/client";
import { handleResponse } from "@/lib/api-client";
import type { CreateUser, UsersResponse, UserCreatedResponse } from "@repo/schema";

export async function fetchUsers(): Promise<UsersResponse> {
  const response = await client.users.$get({});
  return handleResponse<UsersResponse>(response);
}

export async function createUser(userData: CreateUser): Promise<UserCreatedResponse> {
  const response = await client.users.$post({ json: userData });
  return handleResponse<UserCreatedResponse>(response);
}


