"use client";

import { ReactNode } from "react";
import QueryProvider from "@/contexts/QueryProvider";
import AuthProvider from "@/contexts/AuthProvider";

export default function Provider({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </QueryProvider>
    );
}