"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const COLS = 20;
const ROWS = 20;
const SPEED = 120;

type Point = { x: number; y: number };
type Dir = { x: number; y: number };

function randomFood(snake: Point[]): Point {
  const set = new Set(snake.map((s) => `${s.x},${s.y}`));
  let food: Point;
  do {
    food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (set.has(`${food.x},${food.y}`));
  return food;
}

interface Options {
  onGameOver?: (score: number) => void;
}

export interface SnakeGameState {
  snake: Point[];
  food: Point;
  score: number;
  running: boolean;
  gameOver: boolean;
  COLS: number;
  ROWS: number;
  start: () => void;
  restart: () => void;
}

export function useSnake({ onGameOver }: Options = {}): SnakeGameState {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const dir = useRef<Dir>({ x: 1, y: 0 });
  const nextDir = useRef<Dir>({ x: 1, y: 0 });
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const scoreRef = useRef(0);

  snakeRef.current = snake;
  foodRef.current = food;

  const tick = useCallback(() => {
    dir.current = nextDir.current;
    const head = snakeRef.current[0];
    const newHead = {
      x: head.x + dir.current.x,
      y: head.y + dir.current.y,
    };

    if (
      newHead.x < 0 || newHead.x >= COLS ||
      newHead.y < 0 || newHead.y >= ROWS ||
      snakeRef.current.some((s) => s.x === newHead.x && s.y === newHead.y)
    ) {
      setRunning(false);
      setGameOver(true);
      onGameOver?.(scoreRef.current);
      return;
    }

    const ate = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;
    const newSnake = ate
      ? [newHead, ...snakeRef.current]
      : [newHead, ...snakeRef.current.slice(0, -1)];

    if (ate) {
      const newScore = scoreRef.current + 10;
      scoreRef.current = newScore;
      setScore(newScore);
      setFood(randomFood(newSnake));
    }

    setSnake(newSnake);
  }, [onGameOver]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(tick, SPEED);
    return () => clearInterval(interval);
  }, [running, tick]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (!d) return;
      if (d.x === -dir.current.x && d.y === -dir.current.y) return;
      nextDir.current = d;
      e.preventDefault();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const start = () => {
    if (running || gameOver) return;
    setRunning(true);
  };

  const restart = () => {
    const initSnake = [{ x: 10, y: 10 }];
    setSnake(initSnake);
    setFood(randomFood(initSnake));
    setScore(0);
    scoreRef.current = 0;
    dir.current = { x: 1, y: 0 };
    nextDir.current = { x: 1, y: 0 };
    setGameOver(false);
    setRunning(true);
  };

  return { snake, food, score, running, gameOver, COLS, ROWS, start, restart };
}
