"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useScoreStore } from "@/store/scoreStore";
import { RequireAuth } from "@/components/auth/RequireAuth";

const TABS = ["Overview", "Stats", "Settings"] as const;
type Tab = (typeof TABS)[number];

const GAME_ICONS: Record<string, string> = {
  sudoku: "🔢",
  memory: "🃏",
  "click-speed": "⚡",
  snake: "🐍",
  "tic-tac-toe": "✖",
};

function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-lg font-semibold text-heading mb-4 border-b border-border pb-2">
      {title}
    </h2>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const { user } = useAuthStore();
  const { scores } = useScoreStore();

  const userScores = scores.filter((s) => s.userId === user?.id);
  const gamesPlayed = userScores.length;
  const bestScores = ["sudoku", "memory", "click-speed", "snake", "tic-tac-toe"].map(
    (game) => {
      const gameScores = userScores.filter((s) => s.game === game);
      const best = gameScores.length
        ? gameScores.reduce((a, b) => (a.value > b.value ? a : b))
        : null;
      return { game, best };
    }
  );

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto">
        {/* Profile header */}
        <div className="flex items-center gap-5 mb-8 card-shadow bg-card-bg rounded-2xl p-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center text-2xl font-bold text-white">
            {user?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-xl font-bold text-heading">
              {user?.fullName ?? user?.username}
            </p>
            <p className="text-muted text-sm">@{user?.username}</p>
            <p className="text-label text-xs mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-bold text-heading">{gamesPlayed}</p>
            <p className="text-muted text-sm">games played</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-surface-alt rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-surface text-heading card-shadow"
                  : "text-muted hover:text-body"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "Overview" && (
          <div className="animate-rise">
            <SectionHeading title="Best Scores" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestScores.map(({ game, best }) => (
                <div
                  key={game}
                  className="bg-card-bg card-shadow rounded-xl p-4 flex items-center gap-3"
                >
                  <span className="text-2xl">{GAME_ICONS[game]}</span>
                  <div>
                    <p className="text-sm font-semibold text-heading capitalize">
                      {game.replace("-", " ")}
                    </p>
                    <p className="text-muted text-xs">
                      {best
                        ? game === "sudoku"
                          ? `Best time: ${formatTime(best.value)}`
                          : `Best: ${best.value}`
                        : "No games yet"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Stats" && (
          <div className="animate-rise">
            <SectionHeading title="Game Statistics" />
            <div className="space-y-3">
              {["sudoku", "memory", "click-speed", "snake", "tic-tac-toe"].map(
                (game) => {
                  const gs = userScores.filter((s) => s.game === game);
                  return (
                    <div
                      key={game}
                      className="bg-card-bg card-shadow rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{GAME_ICONS[game]}</span>
                        <span className="font-medium text-heading capitalize">
                          {game.replace("-", " ")}
                        </span>
                      </div>
                      <span className="text-muted text-sm">
                        {gs.length} game{gs.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="animate-rise">
            <SectionHeading title="Account Settings" />
            <div className="bg-card-bg card-shadow rounded-xl p-6 space-y-4">
              <div>
                <label className="text-label text-sm block mb-1">
                  Full Name
                </label>
                <p className="text-heading font-medium">
                  {user?.fullName ?? "—"}
                </p>
              </div>
              <div>
                <label className="text-label text-sm block mb-1">
                  Username
                </label>
                <p className="text-heading font-medium">@{user?.username}</p>
              </div>
              <div>
                <label className="text-label text-sm block mb-1">Email</label>
                <p className="text-heading font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// dashboard panel variant
type DashboardPanel = "games" | "stats" | "recent";
