"use client";

import { MemoryCard } from "./MemoryCard";
import type { MemoryCardType } from "@/hooks/useMemory";

interface Props {
  cards: MemoryCardType[];
  onFlip: (id: number) => void;
}

export function MemoryGrid({ cards, onFlip }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
      {cards.map((card) => (
        <MemoryCard key={card.id} card={card} onFlip={() => onFlip(card.id)} />
      ))}
    </div>
  );
}
