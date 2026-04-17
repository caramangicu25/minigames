"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { getMessages, sendMessage, deleteMessage } from "@/lib/api/chat";
import type { ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const msgs = await getMessages();
      setMessages(msgs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending || !isAuthenticated) return;
    setSending(true);
    try {
      const msg = await sendMessage(text.trim());
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-heading mb-1">Global Chat</h1>
        <p className="text-label text-sm">Chat with other players in real time.</p>
      </div>

      <div className="card flex flex-col" style={{ height: "60vh" }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {loading ? (
            <div className="text-center text-label text-sm py-10">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-label text-sm py-10">
              No messages yet. Be the first to say hello!
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = user?.id === msg.userId;
              return (
                <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {msg.username[0].toUpperCase()}
                  </div>
                  <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold text-label ${isOwn ? "order-last" : ""}`}>
                        {msg.username}
                      </span>
                      <span className="text-xs text-muted">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div className={`relative group px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? "bg-accent text-white rounded-tr-sm"
                        : "bg-surface-alt text-body rounded-tl-sm"
                    }`}>
                      {msg.content}
                      {isOwn && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center transition"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border px-4 py-3">
          {isAuthenticated ? (
            <div className="flex gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                maxLength={500}
                className="flex-1 px-4 py-2.5 rounded-xl bg-surface-alt border border-border text-heading placeholder-muted text-sm outline-none focus:border-accent transition"
              />
              <button
                onClick={handleSend}
                disabled={sending || !text.trim()}
                className="px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-40"
              >
                Send
              </button>
            </div>
          ) : (
            <p className="text-center text-label text-sm py-2">
              Sign in to participate in the chat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
