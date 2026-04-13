"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function AuthBootstrapper() {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return null;
}
