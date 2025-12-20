import { create } from "zustand";


interface TurnState {
    turn: string;
    
    change: () => void;
}
const useTurnStore = create<TurnState>((set) => ({
    turn: "white",
    change: () => set((state) => ({ turn: state.turn === "white" ? "black" : "white" }))
}));
  
export default useTurnStore;