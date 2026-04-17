import { create } from 'zustand';

interface AuthState {
    uid: string | null;
    email: string | null;
    role: 'admin' | 'user' | null;
    loading: boolean;
    setUser: (user: { uid: string; email: string; role: 'admin' | 'user' }) => void;
    clearUser: () => void;
    setLoadingComplete: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    uid: null,
    email: null,
    role: null,
    loading: true,
    setUser: (user) =>
        set({
            uid: user.uid,
            email: user.email,
            role: user.role,
            loading: false,
        }),
    clearUser: () =>
        set({
            uid: null,
            email: null,
            role: null,
            loading: false,
        }),
    setLoadingComplete: () => set({ loading: false }),
}));
