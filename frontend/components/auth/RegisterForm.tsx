"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { registerSchema } from "@/lib/validators";

interface Props {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: Props) {
  const { register, isLoading } = useAuthStore();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    const result = registerSchema.safeParse({ fullName, username, email, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    try {
      await register({ fullName, username, email, password });
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-lg px-4 py-2 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-label text-sm mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-body text-sm focus:outline-none focus:border-accent transition"
          />
        </div>
        <div>
          <label className="block text-label text-sm mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
            required
            className="w-full bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-body text-sm focus:outline-none focus:border-accent transition"
          />
        </div>
      </div>
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
      <div>
        <label className="block text-label text-sm mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
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
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
