export type GameId =
  | "sudoku"
  | "memory"
  | "click-speed"
  | "snake"
  | "tic-tac-toe";

export interface GameMeta {
  id: GameId;
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
