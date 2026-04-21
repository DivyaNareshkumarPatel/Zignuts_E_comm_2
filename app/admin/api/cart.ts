"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryId?: string;
  imageUrl?: string;
}

export function useCart(userId: string | null) {
  return useQuery<CartItem[], Error>({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: async () =>
      api<void, CartItem[]>({
        method: "GET",
        endpoint: `/cart?userId=${userId}`,
        module: "",
        skipAuth: true,
      }),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, items }: { userId: string; items: CartItem[] }) =>
      api<{ userId: string; items: CartItem[] }, { success: boolean }>({
        method: "POST",
        endpoint: "/cart",
        data: { userId, items },
        module: "",
        skipAuth: true,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
    },
  });
}

export interface UserOrder {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}

export function useUserOrders(userId: string | null) {
  return useQuery<UserOrder[], Error>({
    queryKey: ["user-orders", userId],
    enabled: !!userId,
    queryFn: async () =>
      api<void, UserOrder[]>({
        method: "GET",
        endpoint: `/orders?userId=${userId}`,
        module: "",
        skipAuth: true,
      }),
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      items,
      total,
    }: {
      userId: string;
      items: CartItem[];
      total: number;
    }) =>
      api<{ userId: string; items: CartItem[]; total: number }, { success: boolean; orderId: string }>({
        method: "POST",
        endpoint: "/orders",
        data: { userId, items, total },
        module: "",
        skipAuth: true,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["user-orders", variables.userId] });
    },
  });
}
