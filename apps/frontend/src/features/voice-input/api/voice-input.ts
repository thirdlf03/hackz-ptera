import { client } from "@/client";
import { handleResponse } from "@/lib/api-client";
import type { VoiceInputRequest, VoiceInputResponse } from "@repo/schema";

export async function transformVoiceInput(request: VoiceInputRequest): Promise<VoiceInputResponse> {
  const response = await client["voice-input"].transform.$post({ json: request });
  return handleResponse<VoiceInputResponse>(response);
}
