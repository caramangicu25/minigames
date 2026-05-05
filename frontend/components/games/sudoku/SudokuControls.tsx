"use client";

type Difficulty = "easy" | "medium" | "hard";

interface Props {
  onNumber: (n: number) => void;
  onErase: () => void;
  onNewGame: () => void;
  difficulty: Difficulty;
  onDifficulty: (d: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export function SudokuControls({ onNumber, onErase, onNewGame, difficulty, onDifficulty }: Props) {
  return (
    <div className="mt-6 space-y-4">
      {/* Difficulty */}
      <div className="flex gap-2 justify-center">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => onDifficulty(d)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              difficulty === d
                ? "bg-accent text-white"
                : "bg-surface-alt text-label hover:text-body"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-9 gap-1.5 max-w-[400px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => onNumber(n)}
            className="aspect-square flex items-center justify-center bg-surface-alt text-heading font-bold rounded-lg text-sm hover:bg-accent hover:text-white transition-colors"
          >
            {n}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={onErase}
          className="px-5 py-2 bg-surface-alt text-label hover:text-body rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1,4 5,1 13,1 13,13 5,13 1,10" />
            <line x1="6" y1="5" x2="10" y2="9" />
            <line x1="10" y1="5" x2="6" y2="9" />
          </svg>
          Erase
        </button>
        <button
          onClick={onNewGame}
          className="px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
