"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useScoreStore } from "@/store/scoreStore";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useRouter } from "next/navigation";
import { getUserAchievements } from "@/lib/api/achievements";
import type { AchievementDto } from "@/types/achievement";

const GAME_ICONS: Record<string, string> = {
  sudoku: "🔢",
  memory: "🃏",
  "click-speed": "⚡",
  snake: "🐍",
  "tic-tac-toe": "✖",
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { scores } = useScoreStore();
  const router = useRouter();

  const [achievements, setAchievements] = useState<AchievementDto[]>([]);

  useEffect(() => {
    if (!user) return;
    getUserAchievements(user.id).then(setAchievements).catch(() => {});
  }, [user?.id]);

  const userScores = scores.filter((s) => s.userId === user?.id);
  const gamesPlayed = userScores.length;

  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto px-4 py-12 animate-rise space-y-10">
        {/* Avatar & name */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center text-4xl font-bold text-white mb-4 card-shadow-heavy">
            {user?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <h1 className="text-2xl font-bold text-heading">
            {user?.fullName ?? user?.username}
          </h1>
          <p className="text-muted">@{user?.username}</p>
          <div className="flex gap-4 mt-3 text-sm text-label">
            <span>
              <span className="text-accent font-bold">{gamesPlayed}</span> scores
            </span>
            {achievements.length > 0 && (
              <span>
                <span className="text-accent font-bold">{unlockedCount}</span> / {achievements.length} achievements
              </span>
            )}
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-5 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            View Dashboard
          </button>
        </div>

        {/* Best scores */}
        <div>
          <h2 className="text-lg font-semibold text-heading mb-4">Best Scores</h2>
          <div className="space-y-3">
            {Object.keys(GAME_ICONS).map((game) => {
              const gs = userScores.filter((s) => s.game === game);
              const best = gs.length
                ? gs.reduce((a, b) => (a.value > b.value ? a : b))
                : null;
              return (
                <div
                  key={game}
                  className="bg-card-bg card-shadow rounded-xl px-5 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{GAME_ICONS[game]}</span>
                    <span className="font-medium text-heading capitalize">
                      {game.replace(/-/g, " ")}
                    </span>
                  </div>
                  <span className="text-accent font-bold">
                    {best
                      ? game === "sudoku"
                        ? `${Math.floor(best.value / 60)}:${(best.value % 60)
                            .toString()
                            .padStart(2, "0")}`
                        : best.value
                      : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-heading mb-4">
              Achievements
              <span className="ml-2 text-sm font-normal text-label">
                {unlockedCount} / {achievements.length} unlocked
              </span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.key}
                  className={`card p-4 flex flex-col gap-2 transition ${
                    a.unlockedAt ? "border-accent/40" : "opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{a.icon}</span>
                    {a.unlockedAt && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-semibold ml-auto">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-heading">{a.title}</p>
                  <p className="text-xs text-label leading-relaxed">{a.description}</p>
                  {a.unlockedAt && (
                    <p className="text-xs text-muted">
                      {new Date(a.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}

type ProfileTab = "stats" | "achievements" | "history";
