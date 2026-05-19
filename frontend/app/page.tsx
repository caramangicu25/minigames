"use client";

import Link from "next/link";
import { HeroHeading } from "@/components/ui/HeroHeading";
import { GameCard } from "@/components/ui/GameCard";

const GAMES = [
  {
    id: "sudoku",
    title: "Sudoku",
    description: "Classic number puzzle. Fill the grid — beat your best time.",
    href: "/games/sudoku",
    icon: "🔢",
    color: "from-violet-500 to-purple-700",
  },
  {
    id: "memory",
    title: "Memory Game",
    description: "Flip cards and match pairs. Test your memory speed.",
    href: "/games/memory",
    icon: "🃏",
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "click-speed",
    title: "Click Speed Test",
    description: "How many clicks per second can you hit? Compete globally.",
    href: "/games/click-speed",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "snake",
    title: "Snake",
    description: "Classic snake. Grow long, don't crash.",
    href: "/games/snake",
    icon: "🐍",
    color: "from-green-500 to-emerald-700",
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "Play against a friend or challenge the bot.",
    href: "/games/tic-tac-toe",
    icon: "✖",
    color: "from-pink-500 to-rose-600",
  },
];

const STATS = [
  { value: "5", label: "Mini Games" },
  { value: "∞", label: "Replays" },
  { value: "🏆", label: "Leaderboards" },
  { value: "📊", label: "Your Stats" },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Create an account", desc: "Sign up in seconds — no email confirmation needed." },
  { step: "2", title: "Pick a game", desc: "Choose from 5 classic games and start playing instantly." },
  { step: "3", title: "Compete & climb", desc: "Save your scores and rise up the global leaderboard." },
];

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Hero */}
      <div className="py-20">
        <HeroHeading
          title="Play. Compete. Win."
          subtitle="Five classic games. Global leaderboards. Your profile, your stats."
        />

        {/* CTA buttons */}
        <div className="flex gap-3 justify-center mt-8">
          <Link
            href="/games/sudoku"
            className="px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:opacity-90 transition"
          >
            Play Now
          </Link>
          <Link
            href="/leaderboard"
            className="px-6 py-3 bg-surface-alt text-body rounded-xl font-semibold hover:bg-accent-soft hover:text-accent transition"
          >
            View Leaderboard
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card-bg card-shadow rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-heading mb-1">{s.value}</p>
              <p className="text-muted text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Games grid */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-heading mb-8 text-center">Choose a Game</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAMES.map((game, i) => (
            <div
              key={game.id}
              className="animate-rise"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <GameCard {...game} />
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold text-heading mb-10 text-center">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="bg-card-bg card-shadow rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-full bg-accent text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-heading mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// hero section variant
type HeroVariant = "default" | "compact";
