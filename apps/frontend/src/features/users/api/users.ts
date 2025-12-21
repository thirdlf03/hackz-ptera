import { client } from "@/client";
import { handleResponse } from "@/lib/api-client";
import type { UsersResponse } from "@repo/schema";

export async function fetchUsers(): Promise<UsersResponse> {
  const response = await client.users.$get({});
  return handleResponse<UsersResponse>(response);
}

export async function createUsers(name: string): Promise<UsersResponse> {
  const response = await client.v1.users.$post({
    json: {
      name: name,
    },
  });
  return handleResponse<UsersResponse>(response);
}
