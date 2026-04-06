import { apiFetch } from "./client";
import type { User } from "@/types/user";

export async function getById(id: string): Promise<User> {
  return apiFetch<User>(`/api/users/${id}`);
}

export async function getAll(): Promise<User[]> {
  return apiFetch<User[]>("/api/users");
}

export async function updateMe(payload: Partial<User>): Promise<User> {
  return apiFetch<User>("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
