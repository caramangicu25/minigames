import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types/user";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

let _token: string | null = null;

function isClient() {
  return typeof window !== "undefined";
}

export function getAuthToken(): string | null {
  if (!isClient()) return null;
  if (_token) return _token;
  return localStorage.getItem("mg_token");
}

export function setAuthToken(token: string) {
  _token = token;
  if (isClient()) localStorage.setItem("mg_token", token);
}

export function clearAuthToken() {
  _token = null;
  if (isClient()) localStorage.removeItem("mg_token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({ message: res.statusText }));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data as T;
}

// Auth
export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password } satisfies LoginRequest),
  });
  setAuthToken(data.token);
  return data;
}

export async function registerUser(payload: RegisterRequest): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  clearAuthToken();
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}

export const DEFAULT_TIMEOUT_MS = 10000;
