"use client";

import { MemoryGrid } from "@/components/games/memory/MemoryGrid";
import { useMemory } from "@/hooks/useMemory";
import { useAuthStore } from "@/store/authStore";
import { useScoreStore } from "@/store/scoreStore";

export default function MemoryPage() {
  const { user } = useAuthStore();
  const { submitScore } = useScoreStore();
  const game = useMemory({
    onComplete: (moves) => {
      if (user) submitScore({ userId: user.id, username: user.username, game: "memory", value: moves }, user.id);
    },
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">🃏 Memory Game</h1>
          <p className="text-muted text-sm">Match all pairs in as few moves as possible.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-heading">{game.moves}</p>
          <p className="text-muted text-xs">moves</p>
        </div>
      </div>

      {game.completed && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 rounded-xl px-5 py-3 text-center font-semibold animate-rise">
          🎉 Completed in {game.moves} moves!
          {!user && <span className="block text-sm font-normal mt-1">Sign in to save your score.</span>}
        </div>
      )}

      <MemoryGrid
        cards={game.cards}
        onFlip={game.flipCard}
      />

      <div className="mt-6 flex justify-center">
        <button
          onClick={game.restart}
          className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          New Game
        </button>
      </div>
    </div>
  );
}

type MemoryGridSize = 4 | 6 | 8;
