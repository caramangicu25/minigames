"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { loginSchema } from "@/lib/validators";

interface Props {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: Props) {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    try {
      await login(email, password);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg px-4 py-2 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-label text-sm mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-body text-sm focus:outline-none focus:border-accent transition"
        />
      </div>
      <div>
        <label className="block text-label text-sm mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-body text-sm focus:outline-none focus:border-accent transition"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
