"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type OrderStatus = "Processing" | "Processed" | "Delivered";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: async () =>
      api<void, Order[]>({
        method: "GET",
        endpoint: "/orders",
        module: "",
        skipAuth: true,
      }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) =>
      api<{ status: OrderStatus }, { success: boolean }>({
        method: "PATCH",
        endpoint: `/orders/${id}`,
        data: { status },
        module: "",
        skipAuth: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
