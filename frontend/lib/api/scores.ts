import { apiFetch } from "./client";
import type { Score, SubmitScoreRequest } from "@/types/score";

export async function submit(payload: SubmitScoreRequest): Promise<Score> {
  return apiFetch<Score>("/api/scores", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getLeaderboard(game?: string): Promise<Score[]> {
  const q = game ? `?game=${game}` : "";
  return apiFetch<Score[]>(`/api/scores/leaderboard${q}`);
}

export async function getByUser(userId: string): Promise<Score[]> {
  return apiFetch<Score[]>(`/api/scores/user/${userId}`);
}
