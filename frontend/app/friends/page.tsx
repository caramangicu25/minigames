"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { RequireAuth } from "@/components/auth/RequireAuth";
import {
  getFriends,
  sendFriendRequest,
  respondToRequest,
  removeFriend,
  getFriendLeaderboard,
} from "@/lib/api/friends";
import type { FriendDto, FriendLeaderboardEntry } from "@/types/friend";

export default function FriendsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [friends, setFriends] = useState<FriendDto[]>([]);
  const [leaderboard, setLeaderboard] = useState<FriendLeaderboardEntry[]>([]);
  const [tab, setTab] = useState<"friends" | "leaderboard">("friends");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [f, lb] = await Promise.all([getFriends(), getFriendLeaderboard()]);
      setFriends(f);
      setLeaderboard(lb);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) load();
    else setLoading(false);
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const accepted = friends.filter((f) => f.status === "accepted");
  const pending = friends.filter((f) => f.status === "pending");
  const incoming = pending.filter((f) => f.direction === "received");
  const outgoing = pending.filter((f) => f.direction === "sent");

  const handleAdd = async () => {
    if (!username.trim()) return;
    setError("");
    setSuccess("");
    try {
      await sendFriendRequest(username.trim());
      setSuccess(`Friend request sent to ${username}!`);
      setUsername("");
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send request");
    }
  };

  const handleRespond = async (id: string, accept: boolean) => {
    await respondToRequest(id, accept);
    load();
  };

  const handleRemove = async (id: string) => {
    await removeFriend(id);
    load();
  };

  if (!user) return <RequireAuth />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-heading mb-1">Friends</h1>
        <p className="text-label text-sm">Connect with others and compare scores.</p>
      </div>

      {/* Add Friend */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-label uppercase tracking-wider mb-3">Add Friend</h2>
        <div className="flex gap-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Enter username..."
            className="flex-1 px-4 py-2 rounded-xl bg-surface-alt border border-border text-heading placeholder-muted text-sm outline-none focus:border-accent transition"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-2 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition"
          >
            Send Request
          </button>
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        {success && <p className="mt-2 text-green-500 text-sm">{success}</p>}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-0">
        {(["friends", "leaderboard"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition border-b-2 -mb-px ${
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-label hover:text-heading"
            }`}
          >
            {t === "friends" ? `Friends (${accepted.length})` : "Score Leaderboard"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-label py-10">Loading...</div>
      ) : tab === "friends" ? (
        <div className="space-y-6">
          {/* Incoming requests */}
          {incoming.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-label uppercase tracking-wider mb-3">
                Incoming Requests ({incoming.length})
              </h3>
              <div className="space-y-2">
                {incoming.map((f) => (
                  <div key={f.friendshipId} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center text-white text-sm font-bold">
                        {f.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-heading font-medium text-sm">{f.username}</p>
                        <p className="text-muted text-xs">{f.fullName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRespond(f.friendshipId, true)}
                        className="px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(f.friendshipId, false)}
                        className="px-3 py-1.5 bg-surface-alt border border-border text-body text-xs font-semibold rounded-lg hover:bg-border transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outgoing requests */}
          {outgoing.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-label uppercase tracking-wider mb-3">
                Sent Requests ({outgoing.length})
              </h3>
              <div className="space-y-2">
                {outgoing.map((f) => (
                  <div key={f.friendshipId} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        {f.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-heading font-medium text-sm">{f.username}</p>
                        <p className="text-muted text-xs">Pending...</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(f.friendshipId)}
                      className="px-3 py-1.5 text-red-500 text-xs font-semibold border border-red-500/30 rounded-lg hover:bg-red-500/10 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accepted friends */}
          <div>
            <h3 className="text-sm font-semibold text-label uppercase tracking-wider mb-3">
              Friends ({accepted.length})
            </h3>
            {accepted.length === 0 ? (
              <div className="card p-8 text-center text-label text-sm">
                No friends yet. Send a request to get started!
              </div>
            ) : (
              <div className="space-y-2">
                {accepted.map((f) => (
                  <div key={f.friendshipId} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center text-white text-sm font-bold">
                        {f.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-heading font-medium text-sm">{f.username}</p>
                        <p className="text-muted text-xs">{f.fullName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(f.friendshipId)}
                      className="px-3 py-1.5 text-red-500 text-xs font-medium hover:underline transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-label font-semibold text-xs uppercase tracking-wider">Player</th>
                <th className="text-left px-5 py-3 text-label font-semibold text-xs uppercase tracking-wider">Game</th>
                <th className="text-right px-5 py-3 text-label font-semibold text-xs uppercase tracking-wider">Best Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-label text-sm">
                    No scores yet. Add friends and start playing!
                  </td>
                </tr>
              ) : (
                leaderboard.map((e, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-surface-alt transition">
                    <td className="px-5 py-3 text-heading font-medium">{e.username}</td>
                    <td className="px-5 py-3 text-body capitalize">{e.game}</td>
                    <td className="px-5 py-3 text-right text-accent font-bold">{e.value.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
