import { create } from "zustand";
import type { Position } from "@repo/schema";

interface TurnState {
  turn: string;
  change: () => void;
}

interface AnimatingPiece {
  id: number;
  from: Position;
  to: Position;
}

interface AnimationState {
  animatingPiece: AnimatingPiece | null;
  startAnimation: (id: number, from: Position, to: Position) => void;
  clearAnimation: () => void;
}

interface TextLocation {
  x: number;
  y: number;
  z: number;
  text: string;
  setTextLocation: (text: string, x: number, y: number, z: number) => void;
  clearText: () => void;
}

export const useTurnStore = create<TurnState>((set) => ({
  turn: "white",
  change: () => set((state) => ({ turn: state.turn === "white" ? "black" : "white" })),
}));

export const useAnimationStore = create<AnimationState>((set) => ({
  animatingPiece: null,
  startAnimation: (id, from, to) => set({ animatingPiece: { id, from, to } }),
  clearAnimation: () => set({ animatingPiece: null }),
}));

export const useTextLocationStore = create<TextLocation>((set) => ({
  x: 0,
  y: 0,
  z: 0,
  text: "",
  setTextLocation: (text, x, y, z) => set({ text, x, y, z }),
  clearText: () => set({ text: "", x: 0, y: 0, z: 0 }),
}));
