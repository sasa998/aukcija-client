"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useMe } from "./hooks/useAuth";

export function AuthInitializer() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { data, status } = useMe();

  useEffect(() => {
    if (status === "success" && data) setUser(data);
    if (status === "error") clearAuth();
  }, [status, data, setUser, clearAuth]);

  return null;
}
