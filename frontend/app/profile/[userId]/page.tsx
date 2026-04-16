"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as usersApi from "@/lib/api/users";
import * as scoresApi from "@/lib/api/scores";
import type { User } from "@/types/user";
import type { Score } from "@/types/score";

const GAME_ICONS: Record<string, string> = {
  sudoku: "🔢",
  memory: "🃏",
  "click-speed": "⚡",
  snake: "🐍",
  "tic-tac-toe": "✖",
};

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [userScores, setUserScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([usersApi.getById(userId), scoresApi.getByUser(userId)])
      .then(([u, s]) => {
        setProfile(u);
        setUserScores(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-32 text-muted">
        Loading...
      </div>
    );
  if (!profile)
    return (
      <div className="flex items-center justify-center py-32 text-muted">
        User not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 animate-rise">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center text-3xl font-bold text-white mb-3 card-shadow-heavy">
          {profile.username[0].toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold text-heading">{profile.fullName}</h1>
        <p className="text-muted">@{profile.username}</p>
        <p className="text-label text-sm mt-1">
          {userScores.length} games played
        </p>
      </div>

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
                <span className="text-xl">{GAME_ICONS[game]}</span>
                <span className="font-medium text-heading capitalize">
                  {game.replace(/-/g, " ")}
                </span>
              </div>
              <span className="text-accent font-bold">
                {best ? best.value : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
