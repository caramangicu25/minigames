"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  getChallengeLeaderboard,
  getChallengeStatus,
  submitChallenge,
  type DailyChallengeEntry,
} from "@/lib/api/challenges";

const GAMES = [
  { id: "snake", label: "🐍 Snake", description: "Highest score in a single run" },
  { id: "memory", label: "🃏 Memory", description: "Fewest moves to solve the board" },
  { id: "click-speed", label: "⚡ Click Speed", description: "Most clicks in 10 seconds" },
  { id: "sudoku", label: "🔢 Sudoku", description: "Fastest solve time" },
];

export default function ChallengesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [selectedGame, setSelectedGame] = useState("snake");
  const [leaderboard, setLeaderboard] = useState<DailyChallengeEntry[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitValue, setSubmitValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const lb = await getChallengeLeaderboard(selectedGame);
      setLeaderboard(lb);
      if (isAuthenticated) {
        const status = await getChallengeStatus(selectedGame);
        setSubmitted(status.submitted);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError("");
    setSuccess("");
    load();
  }, [selectedGame, isAuthenticated]);

  const handleSubmit = async () => {
    const val = parseFloat(submitValue);
    if (isNaN(val) || val <= 0) {
      setError("Please enter a valid score.");
      return;
    }
    setError("");
    try {
      await submitChallenge(selectedGame, val);
      setSuccess("Score submitted successfully!");
      setSubmitValue("");
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Submission failed");
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const game = GAMES.find((g) => g.id === selectedGame)!;

  const rankMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">Daily Challenges</h1>
        <p className="text-label text-sm">{today} — One submission per game per day.</p>
      </div>

      {/* Game selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGame(g.id)}
            className={`card p-4 text-left transition hover:border-accent/60 ${
              selectedGame === g.id ? "border-accent ring-1 ring-accent/30" : ""
            }`}
          >
            <div className="text-xl mb-1">{g.label.split(" ")[0]}</div>
            <div className="text-xs font-semibold text-heading">{g.label.split(" ").slice(1).join(" ")}</div>
            <div className="text-xs text-muted mt-0.5">{g.description}</div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Submit score */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-label uppercase tracking-wider">
            Submit Today&apos;s Score — {game.label}
          </h2>
          {!isAuthenticated ? (
            <p className="text-label text-sm">Sign in to submit your daily challenge score.</p>
          ) : submitted ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-heading font-semibold">Already submitted today!</p>
              <p className="text-label text-sm mt-1">Come back tomorrow for a new challenge.</p>
            </div>
          ) : (
            <>
              <p className="text-body text-sm">{game.description}</p>
              <div className="flex gap-3">
                <input
                  value={submitValue}
                  onChange={(e) => setSubmitValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  type="number"
                  placeholder="Enter your score..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface-alt border border-border text-heading placeholder-muted text-sm outline-none focus:border-accent transition"
                />
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition"
                >
                  Submit
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
            </>
          )}
        </div>

        {/* Leaderboard */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-label uppercase tracking-wider">
            Today&apos;s Leaderboard
          </h2>
          {loading ? (
            <div className="text-center text-label text-sm py-6">Loading...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center text-label text-sm py-6">
              No submissions yet today. Be the first!
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((e) => (
                <div
                  key={e.userId}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition ${
                    user?.id === e.userId ? "bg-accent/10 border border-accent/30" : "bg-surface-alt"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base w-8 text-center">{rankMedal(e.rank)}</span>
                    <span className="text-sm font-medium text-heading">{e.username}</span>
                    {user?.id === e.userId && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-semibold">You</span>
                    )}
                  </div>
                  <span className="text-accent font-bold text-sm">{e.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
