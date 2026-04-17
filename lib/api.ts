'use client'

import { apiClient } from "./apiClient"
import { AxiosError } from "axios"
import { API_METHODS } from "@/constants/constants"
import { buildUrl } from "@/utils/urlBuilder"

interface ApiParams<T=any>{
    method: keyof typeof API_METHODS,
    endpoint: string,
    data?: T,
    queryParams?: Record<string, string | number | boolean>,
    skipAuth?: boolean,
    pathparams?: Record<string, string>
    baseUrl?: string
    headers?: Record<string, string>
    module?: string
}

/** Updated interface to include the 'error' field returned by your API routes */
interface ErrorResponseData {
  message?: string;
  detail?: string;
  error?: string;
}

export const api = async <T=any, R=any>({
    method,
    endpoint,
    data,
    queryParams={},
    skipAuth = false,
    pathparams = {},
    baseUrl,
    headers={},
    module = 'v1',
}: ApiParams<T>): Promise<R> => {
    const relaiveUrl = buildUrl(endpoint, pathparams, module);
    const config = {
        url: baseUrl ? `${baseUrl.replace(/\/$/, '')}${relaiveUrl}` : relaiveUrl,
        method,
        params: queryParams,
        data,
        headers:{
            'Content-Type': 'application/json',
            ...headers,
        },
        skipAuth,
        withCredentials: true,
    }
    
    try {
        const response = await apiClient.request<R>(config);
        return response.data;
    } catch(error) {
        const axiosError = error instanceof AxiosError ? error : null;
        const response = axiosError?.response;

        if(!response) {
            throw error; // Handle network or connection errors
        }

        const errData = response.data as ErrorResponseData | undefined;
        
        // Extract the specific error message sent by the server
        const msg = errData?.error ?? errData?.message ?? errData?.detail ?? "An unexpected error occurred";
        
        // Throwing a new Error ensures React Query's error.message works correctly
        throw new Error(msg);
    }
}