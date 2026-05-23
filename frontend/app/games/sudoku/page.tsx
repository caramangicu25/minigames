"use client";

import { SudokuBoard } from "@/components/games/sudoku/SudokuBoard";
import { SudokuControls } from "@/components/games/sudoku/SudokuControls";
import { useSudoku } from "@/hooks/useSudoku";
import { useAuthStore } from "@/store/authStore";
import { useScoreStore } from "@/store/scoreStore";

export default function SudokuPage() {
  const { user } = useAuthStore();
  const { submitScore } = useScoreStore();
  const game = useSudoku({
    onComplete: (seconds) => {
      if (user) submitScore({ userId: user.id, username: user.username, game: "sudoku", value: seconds }, user.id);
    },
  });

  const elapsed = game.elapsed;
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">🔢 Sudoku</h1>
          <p className="text-muted text-sm">Fill the 9×9 grid. No repeats in rows, columns, or boxes.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-mono font-bold text-heading">
            {m}:{s.toString().padStart(2, "0")}
          </p>
          <p className="text-muted text-xs">elapsed</p>
        </div>
      </div>

      {game.solved && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-xl px-5 py-3 text-center font-semibold animate-rise">
          🎉 Solved in {m}:{s.toString().padStart(2, "0")}!
          {!user && <span className="block text-sm font-normal mt-1">Sign in to save your score.</span>}
        </div>
      )}

      <SudokuBoard
        grid={game.grid}
        original={game.original}
        selected={game.selected}
        errors={game.errors}
        onSelect={game.selectCell}
      />

      <SudokuControls
        onNumber={game.enterNumber}
        onErase={game.erase}
        onNewGame={game.newGame}
        difficulty={game.difficulty}
        onDifficulty={game.setDifficulty}
      />
    </div>
  );
}

type SudokuMode = "classic" | "timed" | "zen";
