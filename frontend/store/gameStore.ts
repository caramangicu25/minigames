import { create } from "zustand";
import type { GameId } from "@/types/game";

interface GameState {
  activeGame: GameId | null;
  setActiveGame: (game: GameId | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeGame: null,
  setActiveGame: (game) => set({ activeGame: game }),
}));
