'use client';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  RESPONSE_CODES,
  COOKIE_NAMES,
  RESPONSE_OK,
  RESPONSE_CREATED,
  API_METHODS,
} from '@/constants/constants';

import {
  isTokenExpired,
  getCookieToken,
  clearAuthCookies,
} from '@/utils/token';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/** Config shape we pass from api.ts; interceptors read skipAuth. */
interface RequestConfigWithSkipAuth extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

function isSkipAuth(config: InternalAxiosRequestConfig): boolean {
  return (config as RequestConfigWithSkipAuth).skipAuth === true;
}

/**
 * API Client for direct backend API calls
 * Handles token refresh with queue pattern for concurrent requests
 *
 * Security Model:
 * - Access Token: non-httpOnly (client can read for expiry check)
 * - Refresh Token: httpOnly (only server can access via /api/auth/refresh)
 */

// Refresh state management
let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

/** Safety timeout: if refresh takes longer than this, abort and clear state */
const REFRESH_TIMEOUT_MS = 10_000;
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Reset all refresh state — call on every success/failure path to prevent stuck state.
 */
const resetRefreshState = () => {
  isRefreshing = false;
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
};

/**
 * Process queued requests after refresh completes
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  refreshQueue = [];
};

/**
 * Clear auth cookies and redirect to login
 */
const handleAuthFailure = () => {
  if (typeof window !== 'undefined') {
    clearAuthCookies();
    window.location.href = '/auth/login';
  }
};

/**
 * Refresh access token via Next.js API route
 * The route reads httpOnly refresh token and calls Django backend
 */
const refreshAccessToken = async (): Promise<string> => {
  const response = await fetch('/api/auth/refresh', {
    method: API_METHODS.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: include cookies
  });

  if (response.status === RESPONSE_OK || response.status === RESPONSE_CREATED) {
    const data = await response.json();

    if (data.success && data.access) {
      return data.access;
    }
  }

  const errorData = (await response.json().catch(() => ({}))) as {
    error?: string;
  };
  throw new Error(errorData?.error ?? 'Token refresh failed');
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
});

/**
 * Request interceptor - Proactive token refresh
 * Checks token expiry BEFORE making request
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (isSkipAuth(config)) {
      return config;
    }

    // Check for server-side execution
    if (typeof window === 'undefined') {
      return config;
    }

    const accessToken = getCookieToken(COOKIE_NAMES.ACCESS_TOKEN);

    // Check if token is missing or expired
    const needsRefresh = !accessToken || isTokenExpired(accessToken);

    if (needsRefresh) {
      if (!isRefreshing) {
        isRefreshing = true;

        // Safety net: if refresh hangs for > 10 s, reset state and drain the queue
        refreshTimeoutId = setTimeout(() => {
          const err = new Error('Token refresh timed out');
          processQueue(err, null);
          resetRefreshState();
          handleAuthFailure();
        }, REFRESH_TIMEOUT_MS);

        try {
          const newAccessToken = await refreshAccessToken();
          processQueue(null, newAccessToken);
          resetRefreshState();
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          processQueue(
            error instanceof Error ? error : new Error(String(error)),
            null
          );
          resetRefreshState();
          handleAuthFailure();
          return Promise.reject(error);
        }
      } else {
        // Refresh already in progress – queue this request
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          });
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          return Promise.reject(error);
        }
      }
    } else {
      // Token is valid, use it
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handle 401 errors (reactive refresh)
 * This is a fallback in case token expires between request check and server validation
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
        _retry?: boolean;
      })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === RESPONSE_CODES.UNAUTHORIZED &&
      !originalRequest._retry &&
      !isSkipAuth(originalRequest)
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        // Safety net timeout
        refreshTimeoutId = setTimeout(() => {
          const err = new Error('Token refresh timed out');
          processQueue(err, null);
          resetRefreshState();
          handleAuthFailure();
        }, REFRESH_TIMEOUT_MS);

        try {
          const newAccessToken = await refreshAccessToken();
          processQueue(null, newAccessToken);
          resetRefreshState();

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(
            refreshError instanceof Error
              ? refreshError
              : new Error(String(refreshError)),
            null
          );
          resetRefreshState();
          handleAuthFailure();
          return Promise.reject(refreshError);
        }
      } else {
        // Wait for ongoing refresh
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          });
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }
    }

    // Handle 403 - Forbidden (permission denied)
    if (error.response?.status === RESPONSE_CODES.FORBIDDEN) {
      // console.error('[API] Forbidden - insufficient permissions');
    }

    return Promise.reject(error);
  }
);
