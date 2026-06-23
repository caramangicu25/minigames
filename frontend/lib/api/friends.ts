import { apiFetch } from "./client";
import type { FriendDto, FriendLeaderboardEntry } from "@/types/friend";

export const getFriends = () => apiFetch<FriendDto[]>("/api/friends");

export const sendFriendRequest = (username: string) =>
  apiFetch<FriendDto>("/api/friends/request", {
    method: "POST",
    body: JSON.stringify({ username }),
  });

export const respondToRequest = (id: string, accept: boolean) =>
  apiFetch<void>(`/api/friends/${id}/respond?accept=${accept}`, { method: "PUT" });

export const removeFriend = (id: string) =>
  apiFetch<void>(`/api/friends/${id}`, { method: "DELETE" });

export const getFriendLeaderboard = () =>
  apiFetch<FriendLeaderboardEntry[]>("/api/friends/leaderboard");

export type FriendSearchParams = { query: string; page?: number };
