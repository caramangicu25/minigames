"use client";

import { useState, useEffect } from "react";
import * as scoresApi from "@/lib/api/scores";
import type { Score } from "@/types/score";

const GAMES = [
  { id: "all", label: "All Games" },
  { id: "sudoku", label: "🔢 Sudoku" },
  { id: "memory", label: "🃏 Memory" },
  { id: "click-speed", label: "⚡ Click Speed" },
  { id: "snake", label: "🐍 Snake" },
  { id: "tic-tac-toe", label: "✖ Tic Tac Toe" },
];

const PODIUM = [
  { rank: 1, icon: "🥇", color: "from-yellow-400 to-yellow-600", size: "h-28" },
  { rank: 2, icon: "🥈", color: "from-gray-300 to-gray-500", size: "h-20" },
  { rank: 3, icon: "🥉", color: "from-amber-500 to-amber-700", size: "h-14" },
];

function formatScore(entry: Score) {
  if (entry.game === "sudoku") {
    const m = Math.floor(entry.value / 60);
    const s = Math.round(entry.value % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
  return String(entry.value);
}

export default function LeaderboardPage() {
  const [activeGame, setActiveGame] = useState("all");
  const [entries, setEntries] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    scoresApi
      .getLeaderboard(activeGame === "all" ? undefined : activeGame)
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [activeGame]);

  const top3 = entries.slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-heading mb-2">🏆 Leaderboard</h1>
        <p className="text-muted">Top 5 scores across all players.</p>
      </div>

      {/* Game filter */}
      <div className="flex gap-2 flex-wrap justify-center mb-10">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeGame === g.id
                ? "bg-accent text-white"
                : "bg-surface-alt text-label hover:text-body"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Podium top 3 */}
      {!loading && top3.length > 0 && (
        <div className="mb-10">
          <div className="flex items-end justify-center gap-4">
            {/* Reorder: 2nd, 1st, 3rd */}
            {[top3[1], top3[0], top3[2]].map((entry, idx) => {
              if (!entry) return <div key={idx} className="w-24" />;
              const podiumIdx = idx === 0 ? 1 : idx === 1 ? 0 : 2;
              const p = PODIUM[podiumIdx];
              return (
                <div key={entry.id} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="text-center">
                    <p className="font-bold text-heading text-sm truncate max-w-[80px]">
                      {entry.username}
                    </p>
                    <p className="text-accent text-xs font-semibold">{formatScore(entry)}</p>
                  </div>
                  <div
                    className={`w-20 rounded-t-xl bg-gradient-to-b ${p.color} ${p.size} flex items-center justify-center text-white font-bold text-xl`}
                  >
                    {p.rank}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card-bg card-shadow rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2rem_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-border text-label text-xs uppercase font-semibold">
          <span>#</span>
          <span>Player</span>
          <span>Game</span>
          <span className="text-right">Score</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-muted">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center text-muted">No scores yet. Be the first!</div>
        ) : (
          entries.map((entry, i) => (
            <div
              key={entry.id}
              className={`grid grid-cols-[2rem_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b border-border last:border-0 transition-colors hover:bg-surface-alt ${
                i < 3 ? "font-semibold" : ""
              }`}
            >
              <span className={`text-sm ${
                i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted"
              }`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </span>
              <span className="text-heading truncate">{entry.username}</span>
              <span className="text-body text-sm capitalize">
                {entry.game.replace(/-/g, " ")}
              </span>
              <span className="text-right text-accent font-bold">
                {formatScore(entry)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
