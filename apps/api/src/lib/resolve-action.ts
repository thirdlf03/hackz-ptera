import type { AIResponse, ResolveActionInput } from "@repo/schema";

export async function resolveAction(input: ResolveActionInput): Promise<AIResponse> {
  const { from, to } = input;

  const randomAttack = Math.random() < 0.5;

  console.log("=== AWS API Call Start ===");
  const res = await fetch("https://ue2gz6ytek.execute-api.ap-northeast-1.amazonaws.com/dev/v1/ai/solve/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "テスト" }),
  });
  console.log("Status:", res.status, res.statusText);
  const responseData = await res.json();
  console.log("Response:", JSON.stringify(responseData, null, 2));
  console.log("=== AWS API Call End ===");



  const reasons = [
    "王を守るための移動",
    "相手の駒を攻撃",
    "中央を制圧する",
    "戦術的な配置",
    "防御的な手",
    "攻撃的な展開",
  ];
  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

  return {
    from,
    to,
    attack: randomAttack,
    reason: randomReason,
  };
}
