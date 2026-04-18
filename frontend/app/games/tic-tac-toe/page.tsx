"use client";

import { TicTacToeBoard } from "@/components/games/tic-tac-toe/TicTacToeBoard";
import { useTicTacToe } from "@/hooks/useTicTacToe";
import { useAuthStore } from "@/store/authStore";
import { useScoreStore } from "@/store/scoreStore";
import { useState } from "react";

export default function TicTacToePage() {
  const { user } = useAuthStore();
  const { submitScore } = useScoreStore();
  const [vsBot, setVsBot] = useState(true);

  const game = useTicTacToe({
    vsBot,
    onWin: () => {
      if (user) submitScore({ userId: user.id, username: user.username, game: "tic-tac-toe", value: 1 }, user.id);
    },
  });

  return (
    <div className="max-w-sm mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-heading">✖ Tic Tac Toe</h1>
        <p className="text-muted text-sm">First to three in a row wins.</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 justify-center mb-6">
        {[
          { label: "vs Bot", value: true },
          { label: "vs Player", value: false },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => { setVsBot(opt.value); game.reset(); }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              vsBot === opt.value
                ? "bg-accent text-white"
                : "bg-surface-alt text-label hover:text-body"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="text-center mb-4 h-8">
        {game.winner ? (
          <p className="text-green-500 font-bold animate-rise">
            {game.winner === "draw" ? "It's a draw!" : `${game.winner} wins! 🎉`}
          </p>
        ) : (
          <p className="text-label text-sm">
            Turn: <span className="font-bold text-heading">{game.current}</span>
            {vsBot && game.current === "O" ? " (Bot thinking...)" : ""}
          </p>
        )}
      </div>

      <TicTacToeBoard
        board={game.board}
        onCell={game.play}
        winner={game.winner}
        winLine={game.winLine}
      />

      <div className="mt-6 flex justify-center">
        <button
          onClick={game.reset}
          className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          New Game
        </button>
      </div>

      {!user && game.winner && game.winner !== "draw" && (
        <p className="text-center text-muted text-sm mt-4">
          Sign in to save your score.
        </p>
      )}
    </div>
  );
}
