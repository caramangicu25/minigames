"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Difficulty = "easy" | "medium" | "hard";

const REMOVE_COUNT: Record<Difficulty, number> = {
  easy: 30,
  medium: 45,
  hard: 55,
};

function generateSolved(): number[][] {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  solve(grid);
  return grid;
}

function isValid(g: number[][], r: number, c: number, n: number) {
  for (let i = 0; i < 9; i++) {
    if (g[r][i] === n || g[i][c] === n) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (g[br + i][bc + j] === n) return false;
  return true;
}

function solve(g: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (g[r][c] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const n of nums) {
          if (isValid(g, r, c, n)) {
            g[r][c] = n;
            if (solve(g)) return true;
            g[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createPuzzle(difficulty: Difficulty) {
  const solved = generateSolved();
  const puzzle = solved.map((r) => [...r]);
  const original: boolean[][] = Array.from({ length: 9 }, () => Array(9).fill(true));

  let count = REMOVE_COUNT[difficulty];
  while (count > 0) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      original[r][c] = false;
      count--;
    }
  }
  return { puzzle, original, solved };
}

interface Options {
  onComplete?: (seconds: number) => void;
}

export function useSudoku({ onComplete }: Options = {}) {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [grid, setGrid] = useState<number[][]>([]);
  const [original, setOriginal] = useState<boolean[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [solved, setSolved] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const newGame = useCallback(() => {
    const { puzzle, original: orig, solved: sol } = createPuzzle(difficulty);
    setGrid(puzzle);
    setOriginal(orig);
    setSolution(sol);
    setSelected(null);
    setErrors(new Set());
    setSolved(false);
    setElapsed(0);
  }, [difficulty]);

  useEffect(() => {
    newGame();
  }, [newGame]);

  useEffect(() => {
    if (solved) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [solved]);

  const selectCell = (r: number, c: number) => setSelected([r, c]);

  const enterNumber = (n: number) => {
    if (!selected || solved) return;
    const [r, c] = selected;
    if (original[r][c]) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = n;
    setGrid(newGrid);

    const newErrors = new Set<string>();
    if (solution[r][c] !== n) newErrors.add(`${r},${c}`);
    setErrors(newErrors);

    const isSolved = newGrid.every((row, ri) =>
      row.every((val, ci) => val === solution[ri][ci])
    );
    if (isSolved) {
      setSolved(true);
      onComplete?.(elapsed);
    }
  };

  const erase = () => {
    if (!selected || solved) return;
    const [r, c] = selected;
    if (original[r][c]) return;
    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = 0;
    setGrid(newGrid);
    const newErrors = new Set(errors);
    newErrors.delete(`${r},${c}`);
    setErrors(newErrors);
  };

  return {
    grid,
    original,
    selected,
    errors,
    solved,
    elapsed,
    difficulty,
    setDifficulty: (d: Difficulty) => { setDifficulty(d); },
    selectCell,
    enterNumber,
    erase,
    newGame,
  };
}
