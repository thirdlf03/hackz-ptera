import type { AIResponse, ResolveActionInput } from "@repo/schema";

export async function resolveAction(input: ResolveActionInput): Promise<AIResponse> {
  const { from, to } = input;

  const randomAttack = Math.random() < 0.5;

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
