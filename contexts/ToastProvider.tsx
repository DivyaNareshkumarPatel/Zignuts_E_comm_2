"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const value = useMemo(
    () => ({
      notify: showToast,
      showToast,
      showSuccess: (message: string) => showToast(message, "success"),
      showError: (message: string) => showToast(message, "error"),
      showInfo: (message: string) => showToast(message, "info"),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4 sm:justify-end sm:px-6">
        <div className="flex w-full max-w-md flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto rounded-3xl border px-5 py-4 shadow-lg transition duration-200 ${
                toast.type === "error"
                  ? "border-red-400 bg-red-600 text-white"
                  : toast.type === "success"
                  ? "border-emerald-400 bg-emerald-600 text-white"
                  : "border-white/10 bg-zinc-950 text-white"
              }`}
            >
              <p className="text-sm leading-6">{toast.message}</p>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
