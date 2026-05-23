"use client";

import { SnakeGame } from "@/components/games/snake/SnakeGame";
import { useSnake } from "@/hooks/useSnake";
import { useAuthStore } from "@/store/authStore";
import { useScoreStore } from "@/store/scoreStore";

export default function SnakePage() {
  const { user } = useAuthStore();
  const { submitScore } = useScoreStore();
  const game = useSnake({
    onGameOver: (score) => {
      if (user) submitScore({ userId: user.id, username: user.username, game: "snake", value: score }, user.id);
    },
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">🐍 Snake</h1>
          <p className="text-muted text-sm">Use arrow keys or WASD to move.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-heading">{game.score}</p>
          <p className="text-muted text-xs">score</p>
        </div>
      </div>

      <SnakeGame game={game} />

      {!user && game.gameOver && (
        <p className="text-center text-muted text-sm mt-4">
          Sign in to save your score.
        </p>
      )}
    </div>
  );
}

type SnakeDifficulty = "easy" | "normal" | "hard";
