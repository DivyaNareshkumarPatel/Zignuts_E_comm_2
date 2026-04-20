"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/slices/authSlice";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { uid, email, role, loading, setUser, clearUser, setLoadingComplete } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const userRole = (userDocSnap.data()?.role as AuthRole) || "user";

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: userRole,
          });
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          clearUser();
        }
      } else {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, [setUser, clearUser]);

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