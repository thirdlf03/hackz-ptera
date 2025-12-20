// apps/api/src/lambda/index.ts
//
// 目的: Bedrock (Converse + Tool use) で「構造化レスポンス」が返ることを確認する最小コード
// 入力: { from: "e2", to: "e4", order: "move" }  (API Gateway event.body 想定)
// 出力: { from, to, attack, reason }             (必ずこの形で返す)
//
// 依存: @aws-sdk/client-bedrock-runtime, zod（あなたはもう入ってる）
//
// Lambda Runtime: Node.js 22.x
// Handler: index.handler
// Build: esbuildで dist/index.mjs を生成する前提（別途スクリプト）
//
// テストイベント例（Lambdaコンソール）:
// { "body": "{\"from\":\"e2\",\"to\":\"e4\",\"order\":\"move\"}" }

import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConversationRole,
  type ConverseCommandInput,
  type ConverseCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";
import { z } from "zod";

/* ======================
 * 入力（solveActionのデモ用）
 * ====================== */
const SolveActionInputSchema = z.object({
  from: z.string().regex(/^[a-h][1-8]$/, "from must be like a1-h8"),
  to: z.string().regex(/^[a-h][1-8]$/, "to must be like a1-h8"),
  order: z.string().min(1), // デモ。後で enum にしてもOK
});
type SolveActionInput = z.infer<typeof SolveActionInputSchema>;

/* ======================
 * 出力（あなたの契約）
 * ====================== */
const SolveActionOutputSchema = z.object({
  from: z.string().regex(/^[a-h][1-8]$/),
  to: z.string().regex(/^[a-h][1-8]$/),
  attack: z.boolean(),
  reason: z.string().min(1),
});
type SolveActionOutput = z.infer<typeof SolveActionOutputSchema>;

/* ======================
 * Tool use (JSON Schema)
 * ====================== */
const solveActionTool = {
  toolSpec: {
    name: "solve_action",
    description:
      "Return ONE chess action as structured JSON. Output must match the schema exactly.",
    inputSchema: {
      json: {
        type: "object",
        additionalProperties: false,
        properties: {
          from: { type: "string", pattern: "^[a-h][1-8]$" },
          to: { type: "string", pattern: "^[a-h][1-8]$" },
          attack: { type: "boolean" },
          reason: { type: "string" },
        },
        required: ["from", "to", "attack", "reason"],
      },
    },
  },
};

const REGION = process.env.AWS_REGION ?? "ap-northeast-1";
// まず安く・速くなら nova-micro / nova-lite が使いやすい
const MODEL_ID = process.env.MODEL_ID ?? "amazon.nova-lite-v1:0";

const client = new BedrockRuntimeClient({ region: REGION });

export const handler = async (event: {
  body?: string | object;
}): Promise<{
  statusCode: number;
  headers: { "Content-Type": string };
  body: string;
}> => {
  try {
    // 1) API Gateway 互換: body を parse（string / object 両対応）
    const rawBody: unknown =
      typeof event.body === "string" ? JSON.parse(event.body) : (event.body ?? {});

    // 2) 入力検証（ここが壊れてたら 400）
    const input: SolveActionInput = SolveActionInputSchema.parse(rawBody);

    // 3) デモ用指示文：構造化を最優先で強制
    //    盤面が無いので「入力の from/to をそのまま返す」方針にして安定させる
    const userText = [
      `You must call the tool "solve_action".`,
      `Do NOT output any plain text.`,
      `This is a demo. Use the provided from/to as-is.`,
      `Return {from,to,attack,reason} as tool arguments.`,
      `order: ${input.order}`,
      `from: ${input.from}`,
      `to: ${input.to}`,
      `attack: set true only if you think this move captures (best-effort).`,
      `reason: short reason.`,
    ].join("\n");

    const request: ConverseCommandInput = {
      modelId: MODEL_ID,
      messages: [
        {
          role: ConversationRole.USER,
          content: [{ text: userText }],
        },
      ],
      toolConfig: {
        tools: [solveActionTool],
        // ★これが肝：ツール使用を強制 → 構造化固定
        toolChoice: { tool: { name: "solve_action" } },
      },
      inferenceConfig: {
        maxTokens: 150,
        temperature: 0.2,
      },
    };

    // 4) Bedrock 呼び出し
    const resp: ConverseCommandOutput = await client.send(new ConverseCommand(request));

    // 5) toolUse.input を抽出
    const contents = resp.output?.message?.content ?? [];
    const toolUse = contents.find((c) => (c as { toolUse?: unknown }).toolUse)?.toolUse as
      | { input?: unknown }
      | undefined;

    if (!toolUse?.input) {
      // toolUse が無い場合：モデルが従ってない / 設定ミス
      console.log("no_tool_output contents=", JSON.stringify(contents));
      return json(502, { error: "no_tool_output" });
    }

    // 6) 最終出力検証（壊れてたら 502）
    const output: SolveActionOutput = SolveActionOutputSchema.parse(toolUse.input);

    // 7) OK
    return json(200, output);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return json(400, { error: "schema_error", details: err.issues });
    }

    const e = err as Error;
    return json(500, { error: "internal_error", message: e.message });
  }
};

function json(
  statusCode: number,
  obj: unknown,
): {
  statusCode: number;
  headers: { "Content-Type": string };
  body: string;
} {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}
