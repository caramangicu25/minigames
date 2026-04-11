"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuthStore } from "@/store/authStore";

export function Footer() {
  const { isAuthenticated } = useAuthStore();
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="border-t border-border bg-surface mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="font-bold text-lg text-heading mb-2">
              Mini<span className="text-accent">Games</span>
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Play classic games, track your scores, and compete globally.
            </p>
          </div>

          {/* Games */}
          <div>
            <p className="text-label text-xs uppercase font-semibold mb-3">Games</p>
            <ul className="space-y-2 text-sm">
              {[
                ["/games/sudoku", "🔢 Sudoku"],
                ["/games/memory", "🃏 Memory"],
                ["/games/click-speed", "⚡ Click Speed"],
                ["/games/snake", "🐍 Snake"],
                ["/games/tic-tac-toe", "✖ Tic Tac Toe"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-body hover:text-heading transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-label text-xs uppercase font-semibold mb-3">Account</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/leaderboard" className="text-body hover:text-heading transition">
                  🏆 Leaderboard
                </Link>
              </li>
              {!isAuthenticated ? (
                <>
                  <li>
                    <button onClick={() => setAuthModal("login")} className="text-body hover:text-heading transition">
                      Sign In
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setAuthModal("register")} className="text-body hover:text-heading transition">
                      Create Account
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/profile" className="text-body hover:text-heading transition">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-body hover:text-heading transition">
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <p>© {year} MiniGames. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-body transition">Privacy</Link>
            <Link href="#" className="hover:text-body transition">Terms</Link>
          </div>
        </div>
      </footer>

      {authModal && (
        <AuthModal initialView={authModal} onClose={() => setAuthModal(null)} />
      )}
    </>
  );
}
