import { create } from "zustand";
import * as api from "@/lib/api/client";
import type { User, RegisterRequest } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: api.getAuthToken(),
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await api.login(email, password);
      set({ user: data.user, token: data.token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true });
    try {
      const data = await api.registerUser(payload);
      set({ user: data.user, token: data.token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    api.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = api.getAuthToken();
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const user = await api.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      api.clearAuthToken();
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";
