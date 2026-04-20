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
    // 1. Listen to Firebase Authentication state changes directly
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 2. Fetch the user's role from Firestore
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          const userRole = (userDocSnap.data()?.role as AuthRole) || "user";

          // 3. Update the global Zustand state (this also sets loading to false)
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: userRole,
          });
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          clearUser(); // Sets loading to false and clears state
        }
      } else {
        // No user is signed in to Firebase
        clearUser();
      }
    });

    // Cleanup subscription on unmount
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