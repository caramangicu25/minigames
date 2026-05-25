"use client";

import type { SnakeGameState } from "@/hooks/useSnake";

const CELL = 20;

interface Props {
  game: SnakeGameState;
}

export function SnakeGame({ game }: Props) {
  const { snake, food, running, gameOver, score, start, restart, COLS, ROWS } = game;

  const snakeSet = new Set(snake.map((s) => `${s.x},${s.y}`));

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative bg-surface-alt rounded-xl overflow-hidden card-shadow-heavy border border-border"
        style={{ width: COLS * CELL, height: ROWS * CELL }}
      >
        {/* Grid dots */}
        <svg
          className="absolute inset-0 opacity-10"
          width={COLS * CELL}
          height={ROWS * CELL}
        >
          {Array.from({ length: ROWS + 1 }).map((_, y) =>
            Array.from({ length: COLS + 1 }).map((_, x) => (
              <circle key={`${x},${y}`} cx={x * CELL} cy={y * CELL} r="1" fill="currentColor" className="text-border" />
            ))
          )}
        </svg>

        {/* Food */}
        <div
          className="absolute flex items-center justify-center text-lg"
          style={{
            width: CELL,
            height: CELL,
            left: food.x * CELL,
            top: food.y * CELL,
          }}
        >
          🍎
        </div>

        {/* Snake */}
        {snake.map((seg, i) => (
          <div
            key={i}
            className={`absolute rounded-sm transition-none ${
              i === 0 ? "bg-accent" : "bg-accent/70"
            }`}
            style={{
              width: CELL - 2,
              height: CELL - 2,
              left: seg.x * CELL + 1,
              top: seg.y * CELL + 1,
            }}
          />
        ))}

        {/* Overlay */}
        {(!running || gameOver) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 backdrop-blur-sm">
            {gameOver ? (
              <>
                <p className="text-white font-bold text-xl">Game Over! Score: {score}</p>
                <button
                  onClick={restart}
                  className="px-5 py-2 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  Restart
                </button>
              </>
            ) : (
              <>
                <p className="text-white font-bold text-lg">Use arrow keys or WASD</p>
                <button
                  onClick={start}
                  className="px-6 py-2 bg-accent text-white rounded-lg font-bold hover:opacity-90 transition"
                >
                  Start
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-muted text-sm">Arrow keys / WASD to move</p>
    </div>
  );
}

type GridCell = { x: number; y: number };
