"use client";

import { useEffect } from "react";
import { useScoreStore } from "@/store/scoreStore";

export function AchievementToast() {
  const { newAchievements, clearNewAchievements } = useScoreStore();

  useEffect(() => {
    if (newAchievements.length === 0) return;
    const timer = setTimeout(clearNewAchievements, 4000);
    return () => clearTimeout(timer);
  }, [newAchievements, clearNewAchievements]);

  if (newAchievements.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {newAchievements.map((a) => (
        <div
          key={a.key}
          className="flex items-center gap-3 bg-surface border border-accent/40 card-shadow-heavy rounded-xl px-5 py-4 animate-rise"
        >
          <span className="text-2xl">{a.icon}</span>
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider">Achievement Unlocked!</p>
            <p className="text-sm font-bold text-heading">{a.title}</p>
            <p className="text-xs text-label">{a.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
