import { APIError, NetworkError } from "@/lib/errors";

export async function handleResponse<T>(response: Response): Promise<T> {
  try {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.error?.message || "Request failed",
        response.status,
        errorData.error?.code,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new NetworkError("Network request failed");
  }
}
