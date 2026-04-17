import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.items.find((entry) => entry.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ items: [] }),
  setCart: (items) => set({ items }),
}));
