"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useAuthStore } from "@/store/slices/authSlice";

interface AuthContextValue {
  uid: string | null;
  email: string | null;
  role: "admin" | "user" | null;
  loading: boolean;
  setUser: (user: { uid: string; email: string; role: "admin" | "user" }) => void;
  clearUser: () => void;
  setLoadingComplete: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { uid, email, role, loading, setUser, clearUser, setLoadingComplete } =
    useAuthStore();

  const value = useMemo(
    () => ({ uid, email, role, loading, setUser, clearUser, setLoadingComplete }),
    [uid, email, role, loading, setUser, clearUser, setLoadingComplete]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
