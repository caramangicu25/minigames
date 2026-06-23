import { apiFetch } from "./client";

export interface DailyChallengeEntry {
  userId: string;
  username: string;
  game: string;
  value: number;
  createdAt: string;
}

export const getChallengeLeaderboard = (game: string) =>
  apiFetch<DailyChallengeEntry[]>(`/api/challenges/leaderboard/${game}`);

export const getChallengeStatus = (game: string) =>
  apiFetch<{ submitted: boolean }>(`/api/challenges/status/${game}`);

export const submitChallenge = (game: string, value: number) =>
  apiFetch<DailyChallengeEntry>("/api/challenges", {
    method: "POST",
    body: JSON.stringify({ game, value }),
  });
