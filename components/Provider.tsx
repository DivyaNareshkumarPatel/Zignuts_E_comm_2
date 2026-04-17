"use client";

import { ReactNode } from "react";
import QueryProvider from "@/contexts/QueryProvider";
import AuthProvider from "@/contexts/AuthProvider";
import ToastProvider from "@/contexts/ToastProvider";

export default function Provider({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <AuthProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </AuthProvider>
        </QueryProvider>
    );
}