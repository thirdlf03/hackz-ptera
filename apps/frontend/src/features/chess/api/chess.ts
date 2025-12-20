import { client } from "@/client";
import { handleResponse } from "@/lib/api-client";
import type {UsersResponse, Piece, AIResponse, initGame, initGameResponse } from "@repo/schema";

export async function fetch(): Promise<UsersResponse> {
    const response = await client.users.$get({});
    return handleResponse<UsersResponse>(response);
  }

export async function resolveAction(pieces: Piece[], from: string, to: string, order: string): Promise<AIResponse> {
    const response = await client.v1.resolveAction.$post({json : {
        pieces: pieces,
        from: from,
        to: to,
        order: order
    }})
    return handleResponse<AIResponse>(response);
}

export async function initGame(initData: initGame): Promise<initGameResponse> {
    const response = await client.v1.createGame.$post({json: {
        player_id: initData.player_id,
        enemy_id: initData.enemy_id,
        first_player: initData.first_player
    }})
    return handleResponse<initGameResponse>(response);
}
