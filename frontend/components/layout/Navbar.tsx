"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthModal } from "@/components/auth/AuthModal";

type AuthView = "login" | "register";

const GAMES = [
  { href: "/games/sudoku", label: "🔢 Sudoku" },
  { href: "/games/memory", label: "🃏 Memory" },
  { href: "/games/click-speed", label: "⚡ Click Speed" },
  { href: "/games/snake", label: "🐍 Snake" },
  { href: "/games/tic-tac-toe", label: "✖ Tic Tac Toe" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [authModal, setAuthModal] = useState<AuthView | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY.current || y < 60);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 navbar-glass transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-heading hover:text-accent transition">
            Mini<span className="text-accent">Games</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {/* Games dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGamesOpen(true)}
              onMouseLeave={() => setGamesOpen(false)}
            >
              <button className="text-label hover:text-heading transition font-medium flex items-center gap-1">
                Games
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <polyline points="2,4 6,8 10,4" />
                </svg>
              </button>
              {gamesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-surface card-shadow-heavy rounded-xl py-2 animate-rise">
                  {GAMES.map((g) => (
                    <Link
                      key={g.href}
                      href={g.href}
                      className="block px-4 py-2 text-sm text-body hover:bg-surface-alt hover:text-heading transition"
                    >
                      {g.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/leaderboard" className="text-label hover:text-heading transition font-medium">
              Leaderboard
            </Link>

            <Link href="/challenges" className="text-label hover:text-heading transition font-medium">
              Challenges
            </Link>

            <Link href="/friends" className="text-label hover:text-heading transition font-medium">
              Friends
            </Link>

            <Link href="/chat" className="text-label hover:text-heading transition font-medium">
              Chat
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-alt transition"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center text-white text-xs font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-heading hidden sm:block">
                    {user.username}
                  </span>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface card-shadow-heavy rounded-xl py-2 animate-rise">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-body hover:bg-surface-alt hover:text-heading transition">
                      Profile
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-body hover:bg-surface-alt hover:text-heading transition">
                      Dashboard
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={() => { logout(); setDropOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-surface-alt transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setAuthModal("login")}
                  className="px-4 py-1.5 text-sm font-medium text-body hover:text-heading transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthModal("register")}
                  className="px-4 py-1.5 text-sm font-medium bg-accent text-white rounded-lg hover:opacity-90 transition"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-body transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-body transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-body transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-2 animate-rise">
            {GAMES.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm text-body hover:text-heading transition"
              >
                {g.label}
              </Link>
            ))}
            <Link href="/leaderboard" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-body hover:text-heading transition">
              🏆 Leaderboard
            </Link>
            <Link href="/challenges" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-body hover:text-heading transition">
              🎯 Challenges
            </Link>
            <Link href="/friends" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-body hover:text-heading transition">
              👥 Friends
            </Link>
            <Link href="/chat" onClick={() => setMenuOpen(false)} className="block py-2 text-sm text-body hover:text-heading transition">
              💬 Chat
            </Link>
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { setAuthModal("login"); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm font-medium border border-border rounded-lg text-body hover:bg-surface-alt transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModal("register"); setMenuOpen(false); }}
                  className="flex-1 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:opacity-90 transition"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16" />

      {authModal && (
        <AuthModal
          initialView={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  );
}
