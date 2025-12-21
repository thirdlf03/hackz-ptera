import { client } from "@/client";
import { handleResponse } from "@/lib/api-client";
import type { UsersResponse, UserCreatedResponse } from "@repo/schema";

export async function fetchUsers(): Promise<UsersResponse> {
  const response = await client.users.$get({});
  return handleResponse<UsersResponse>(response);
}

export async function createUser(name: string): Promise<UserCreatedResponse> {
  const response = await client.v1.users.$post({
    json: {
      name: name,
    },
  });
  return handleResponse<UserCreatedResponse>(response);
}
