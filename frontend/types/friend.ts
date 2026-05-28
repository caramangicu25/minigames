export interface FriendDto {
  friendshipId: string;
  userId: string;
  username: string;
  fullName: string;
  status: string;
  direction: "sent" | "received";
  createdAt: string;
}

export interface FriendLeaderboardEntry {
  userId: string;
  username: string;
  game: string;
  value: number;
}

export type OnlineStatus = "online" | "offline" | "away";
