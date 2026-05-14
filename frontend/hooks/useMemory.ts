"use client";

import { useState, useCallback } from "react";

export interface MemoryCardType {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

function createCards(): MemoryCardType[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  return shuffle(pairs).map((emoji, i) => ({
    id: i,
    emoji,
    flipped: false,
    matched: false,
  }));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Options {
  onComplete?: (moves: number) => void;
}

export function useMemory({ onComplete }: Options = {}) {
  const [cards, setCards] = useState<MemoryCardType[]>(createCards);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [locked, setLocked] = useState(false);

  const flipCard = useCallback(
    (id: number) => {
      if (locked || completed) return;
      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;

      const newCards = cards.map((c) =>
        c.id === id ? { ...c, flipped: true } : c
      );
      const newFlipped = [...flippedIds, id];

      setCards(newCards);
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        setLocked(true);

        const [a, b] = newFlipped.map((fid) => newCards.find((c) => c.id === fid)!);
        setTimeout(() => {
          if (a.emoji === b.emoji) {
            const matched = newCards.map((c) =>
              c.id === a.id || c.id === b.id ? { ...c, matched: true } : c
            );
            setCards(matched);
            setFlippedIds([]);
            setLocked(false);
            if (matched.every((c) => c.matched)) {
              setCompleted(true);
              onComplete?.(moves + 1);
            }
          } else {
            setCards(
              newCards.map((c) =>
                c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
              )
            );
            setFlippedIds([]);
            setLocked(false);
          }
        }, 900);
      }
    },
    [cards, flippedIds, locked, completed, moves, onComplete]
  );

  const restart = () => {
    setCards(createCards());
    setFlippedIds([]);
    setMoves(0);
    setCompleted(false);
    setLocked(false);
  };

  return { cards, moves, completed, flipCard, restart };
}

export type MemoryMoveCount = number;
