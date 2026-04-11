"use client";

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-accent-soft transition"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="9" r="4" />
          <line x1="9" y1="1" x2="9" y2="3" />
          <line x1="9" y1="15" x2="9" y2="17" />
          <line x1="1" y1="9" x2="3" y2="9" />
          <line x1="15" y1="9" x2="17" y2="9" />
          <line x1="3.2" y1="3.2" x2="4.6" y2="4.6" />
          <line x1="13.4" y1="13.4" x2="14.8" y2="14.8" />
          <line x1="3.2" y1="14.8" x2="4.6" y2="13.4" />
          <line x1="13.4" y1="4.6" x2="14.8" y2="3.2" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 9.5A6.5 6.5 0 1 1 8.5 3a5 5 0 0 0 6.5 6.5z" />
        </svg>
      )}
    </button>
  );
}
