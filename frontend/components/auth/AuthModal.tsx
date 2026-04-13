"use client";

import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type View = "login" | "register";

interface Props {
  initialView?: View;
  onClose: () => void;
}

export function AuthModal({ initialView = "login", onClose }: Props) {
  const [view, setView] = useState<View>(initialView);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-surface card-shadow-heavy rounded-2xl w-full max-w-[440px] p-8 animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-body transition"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-heading mb-1">
          {view === "login" ? "Sign in" : "Create account"}
        </h2>
        <p className="text-muted text-sm mb-6">
          {view === "login"
            ? "Welcome back! Enter your credentials."
            : "Join MiniGames and track your scores."}
        </p>

        {view === "login" ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}

        {/* Toggle */}
        <p className="text-center text-sm text-muted mt-6">
          {view === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setView(view === "login" ? "register" : "login")}
            className="text-accent font-medium hover:underline"
          >
            {view === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
