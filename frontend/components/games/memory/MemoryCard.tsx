"use client";

import type { MemoryCardType } from "@/hooks/useMemory";

interface Props {
  card: MemoryCardType;
  onFlip: () => void;
}

export function MemoryCard({ card, onFlip }: Props) {
  const { flipped, matched, emoji } = card;
  const revealed = flipped || matched;

  return (
    <button
      onClick={() => !revealed && onFlip()}
      disabled={revealed}
      className="aspect-square perspective"
      style={{ perspective: "600px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-700 card-shadow"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-white text-2xl">?</span>
        </div>
        {/* Front */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-xl card-shadow text-3xl
            ${matched ? "bg-green-500/20 border border-green-500/40" : "bg-card-bg border border-border"}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {emoji}
        </div>
      </div>
    </button>
  );
}
