import type { AIResponse, ResolveActionInput } from "@repo/schema";

export async function resolveAction(input: ResolveActionInput): Promise<AIResponse> {
  console.log("=== AWS API Call Start ===");
  console.log("Input:", JSON.stringify(input, null, 2));

  const res = await fetch(
    "https://ue2gz6ytek.execute-api.ap-northeast-1.amazonaws.com/dev/v1/ai/solve/action",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        piece_id: input.piece_id,
        pieces: input.pieces,
        from: input.from,
        to: input.to,
        order: input.order,
      }),
    },
  );

  console.log("Status:", res.status, res.statusText);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API Error:", errorText);
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  const responseData: AIResponse = await res.json();
  console.log("Response:", JSON.stringify(responseData, null, 2));
  console.log("=== AWS API Call End ===");

  return responseData;
}
