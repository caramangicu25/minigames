import { create } from "zustand";
import * as scoresApi from "@/lib/api/scores";
import { checkAchievements } from "@/lib/api/achievements";
import type { Score, SubmitScoreRequest } from "@/types/score";
import type { AchievementDto } from "@/types/achievement";

interface ScoreState {
  scores: Score[];
  isSubmitting: boolean;
  newAchievements: AchievementDto[];

  submitScore: (payload: SubmitScoreRequest, userId?: string) => Promise<void>;
  loadUserScores: (userId: string) => Promise<void>;
  clearNewAchievements: () => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
  scores: [],
  isSubmitting: false,
  newAchievements: [],

  submitScore: async (payload, userId) => {
    set({ isSubmitting: true });
    try {
      const score = await scoresApi.submit(payload);
      set((state) => ({ scores: [score, ...state.scores] }));
      if (userId) {
        const unlocked = await checkAchievements(userId, payload.game, payload.value);
        if (unlocked.length > 0) {
          set({ newAchievements: unlocked });
        }
      }
    } catch {
      // silently fail
    } finally {
      set({ isSubmitting: false });
    }
  },

  loadUserScores: async (userId) => {
    try {
      const scores = await scoresApi.getByUser(userId);
      set({ scores });
    } catch {
      // ignore
    }
  },

  clearNewAchievements: () => set({ newAchievements: [] }),
}));

export type ScorePage = { data: unknown[]; total: number; page: number };
