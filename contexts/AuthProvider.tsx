"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/slices/authSlice";
import { api } from "@/lib/api";

export type AuthRole = "admin" | "user";

interface AuthContextValue {
  uid: string | null;
  email: string | null;
  role: AuthRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: { uid: string; email: string; role: AuthRole }) => void;
  clearUser: () => void;
  setLoadingComplete: () => void;
  hasRole: (role: AuthRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface RefreshResponse {
  user?: {
    uid: string;
    email: string;
    role: AuthRole;
  };
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { uid, email, role, loading, setUser, clearUser, setLoadingComplete } =
    useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await api<void, RefreshResponse>({
          method: "POST",
          endpoint: "/auth/refresh",
          skipAuth: true,
          module: "",
        });

        if (data.user) {
          setUser({
            uid: data.user.uid,
            email: data.user.email,
            role: data.user.role,
          });
        } else {
          setLoadingComplete();
        }
      } catch {
        setLoadingComplete();
      }
    };

    if (loading) {
      initializeAuth();
    }
  }, [loading, setUser, setLoadingComplete]);

  const isAuthenticated = Boolean(uid);
  const isAdmin = role === "admin";

  const value = useMemo(
    () => ({
      uid,
      email,
      role,
      loading,
      isAuthenticated,
      isAdmin,
      setUser,
      clearUser,
      setLoadingComplete,
      hasRole: (targetRole: AuthRole) => role === targetRole,
    }),
    [uid, email, role, loading, isAuthenticated, isAdmin, setUser, clearUser, setLoadingComplete]
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
