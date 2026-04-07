import { apiFetch } from "./client";
import type { AchievementDto } from "@/types/achievement";

export const getAllAchievements = () =>
  apiFetch<AchievementDto[]>("/api/achievements/all");

export const getUserAchievements = (userId: string) =>
  apiFetch<AchievementDto[]>(`/api/achievements/user/${userId}`);

export const checkAchievements = (userId: string, game: string, value: number) =>
  apiFetch<AchievementDto[]>("/api/achievements/check", {
    method: "POST",
    body: JSON.stringify({ userId, game, value }),
  });
