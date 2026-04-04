export type GameType =
  | "sudoku"
  | "memory"
  | "click-speed"
  | "snake"
  | "tic-tac-toe";

export interface Score {
  id: string;
  userId: string;
  username: string;
  game: GameType;
  value: number;
  createdAt: string;
}

export interface SubmitScoreRequest {
  userId: string;
  username: string;
  game: GameType;
  value: number;
}
