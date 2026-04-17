"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthProvider";
import { api } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  uid: string;
  email: string;
  role: "admin" | "user";
  accessToken: string;
  refreshToken?: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
  user?: {
    uid: string;
    email: string;
    role: "admin" | "user";
  };
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface SignupResponse {
  uid: string;
  email: string;
  role: "admin" | "user";
  accessToken: string;
  refreshToken?: string;
}

export function useAuth() {
  return useAuthContext();
}

export function useLogin() {
  const auth = useAuthContext();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (payload: LoginRequest) =>
      api<LoginRequest, LoginResponse>({
        method: "POST",
        endpoint: "/auth/login",
        data: payload,
        skipAuth: true,
        module: "",
      }),
    onSuccess: (data) => {
      auth.setUser({ uid: data.uid, email: data.email, role: data.role });
    },
  });
}

export function useSignup() {
  const auth = useAuthContext();

  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: async (payload: SignupRequest) =>
      api<SignupRequest, SignupResponse>({
        method: "POST",
        endpoint: "/auth/signup",
        data: payload,
        skipAuth: true,
        module: "",
      }),
    onSuccess: (data) => {
      auth.setUser({ uid: data.uid, email: data.email, role: data.role });
    },
  });
}

export function useRefreshToken() {
  const auth = useAuthContext();

  return useMutation<RefreshResponse, Error, void>({
    mutationFn: async () =>
      api<void, RefreshResponse>({
        method: "POST",
        endpoint: "/auth/refresh",
        skipAuth: true,
        module: "",
      }),
    onSuccess: (data) => {
      if (data.user) {
        auth.setUser({
          uid: data.user.uid,
          email: data.user.email,
          role: data.user.role,
        });
      } else {
        auth.setLoadingComplete();
      }
    },
  });
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface CurrentUser {
  uid: string | null;
  email: string | null;
  role: "admin" | "user" | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useLogout() {
  const auth = useAuthContext();

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: async () =>
      api<void, LogoutResponse>({
        method: "POST",
        endpoint: "/auth/logout",
        skipAuth: true,
        module: "",
      }),
    onSuccess: () => {
      auth.clearUser();
    },
  });
}

export function useCurrentUser(): CurrentUser {
  const { uid, email, role, loading } = useAuthContext();
  return {
    uid,
    email,
    role,
    loading,
    isAuthenticated: Boolean(uid),
  };
}