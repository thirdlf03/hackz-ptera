import { client } from "@/client";
import { handleResponse } from "@/lib/api-client";
import type { UsersResponse } from "@repo/schema";

export async function fetchUsers(): Promise<UsersResponse> {
  const response = await client.users.$get({});
  return handleResponse<UsersResponse>(response);
}
