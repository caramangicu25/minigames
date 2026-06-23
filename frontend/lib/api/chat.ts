import { apiFetch } from "./client";
import type { ChatMessage } from "@/types/chat";

export const getMessages = () => apiFetch<ChatMessage[]>("/api/chat");

export const sendMessage = (content: string) =>
  apiFetch<ChatMessage>("/api/chat", {
    method: "POST",
    body: JSON.stringify({ content }),
  });

export const deleteMessage = (id: string) =>
  apiFetch<void>(`/api/chat/${id}`, { method: "DELETE" });
