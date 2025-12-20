import { create } from "zustand";
import type { Position } from "@repo/schema";

interface TurnState {
  turn: string;
  change: () => void;
}

interface PositionChangeState {
  beforePosition: Position;
  afterPosition: Position;
  change: (before: Position, after: Position) => void;
}

export const useTurnStore = create<TurnState>((set) => ({
  turn: "white",
  change: () =>
    set((state) => ({ turn: state.turn === "white" ? "black" : "white" })),
}));

export const usePositionChangeStore = create<PositionChangeState>((set) => ({
  beforePosition: { x: -1, y: -1, z: -1 },
  afterPosition: { x: -1, y: -1, z: -1 },
  change: (before: Position, after: Position) =>
    set(() => ({ beforePosition: before, afterPosition: after })),
}));
