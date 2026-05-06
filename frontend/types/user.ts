export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: "Bearer";
  expiresAtUtc: string;
  user: User;
}

export type AvatarUrl = string;
