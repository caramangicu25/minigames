export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
}

export type MessageStatus = "sent" | "delivered" | "read";
