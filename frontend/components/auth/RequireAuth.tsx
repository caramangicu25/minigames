"use client";

import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

export function RequireAuth({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-muted">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-muted">You need to be signed in to view this page.</p>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          Sign In
        </button>
        {showModal && (
          <AuthModal
            initialView="login"
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}
