'use client';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { RESPONSE_CODES, COOKIE_NAMES } from '@/constants/constants';
import { clearAuthCookies, getCookieToken } from '@/utils/token';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface RequestConfigWithSkipAuth extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

function isSkipAuth(config: InternalAxiosRequestConfig): boolean {
  return (config as RequestConfigWithSkipAuth).skipAuth === true;
}

const handleAuthFailure = () => {
  if (typeof window !== 'undefined') {
    clearAuthCookies();
    const currentPath = window.location.pathname + window.location.search;
    const redirectParam = encodeURIComponent(currentPath);
    window.location.href = `/auth/login?redirect=${redirectParam}`;
  }
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    if (isSkipAuth(config)) return config;
    if (typeof window === 'undefined') return config;

    const accessToken = getCookieToken(COOKIE_NAMES.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (
      error.response?.status === RESPONSE_CODES.UNAUTHORIZED &&
      !isSkipAuth(originalRequest)
    ) {
      handleAuthFailure();
    }

    return Promise.reject(error);
  }
);