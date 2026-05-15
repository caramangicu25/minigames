"use client";

import { useState, useEffect } from "react";

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: (string | null)[]): { winner: string; line: number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a]!, line };
    }
  }
  if (board.every((c) => c !== null)) return { winner: "draw", line: [] };
  return null;
}

function botMove(board: (string | null)[]): number {
  // Try to win
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === "O").length === 2 && vals.includes(null)) {
      return line[vals.indexOf(null)];
    }
  }
  // Block player
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const vals = [board[a], board[b], board[c]];
    if (vals.filter((v) => v === "X").length === 2 && vals.includes(null)) {
      return line[vals.indexOf(null)];
    }
  }
  // Center
  if (!board[4]) return 4;
  // Random empty
  const empty = board.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
  return empty[Math.floor(Math.random() * empty.length)];
}

interface Options {
  vsBot?: boolean;
  onWin?: () => void;
}

export function useTicTacToe({ vsBot = true, onWin }: Options = {}) {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [current, setCurrent] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [winLine, setWinLine] = useState<number[] | null>(null);

  useEffect(() => {
    if (vsBot && current === "O" && !winner) {
      const timer = setTimeout(() => {
        setBoard((prev) => {
          const result = checkWinner(prev);
          if (result) return prev;
          const idx = botMove(prev);
          if (idx === undefined) return prev;
          const next = [...prev];
          next[idx] = "O";
          const r = checkWinner(next);
          if (r) {
            setWinner(r.winner);
            setWinLine(r.line.length > 0 ? r.line : null);
          } else {
            setCurrent("X");
          }
          return next;
        });
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [current, vsBot, winner]);

  const play = (i: number) => {
    if (board[i] || winner) return;
    if (vsBot && current === "O") return;

    const next = [...board];
    next[i] = current;
    setBoard(next);

    const result = checkWinner(next);
    if (result) {
      setWinner(result.winner);
      setWinLine(result.line.length > 0 ? result.line : null);
      if (result.winner === current) onWin?.();
    } else {
      setCurrent(current === "X" ? "O" : "X");
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setCurrent("X");
    setWinner(null);
    setWinLine(null);
  };

  return { board, current, winner, winLine, play, reset };
}

export type TicTacToeResult = "X" | "O" | "draw" | null;
