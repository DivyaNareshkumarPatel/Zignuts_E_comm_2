"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  categoryId?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId?: string;
  imageUrl?: string;
  createdAt: string;
}

export function useProducts() {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () =>
      api<void, Product[]>({
        method: "GET",
        endpoint: "/products",
        module: "",
        skipAuth: true,
      }),
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductRequest>({
    mutationFn: async (payload: CreateProductRequest) =>
      api<CreateProductRequest, Product>({
        method: "POST",
        endpoint: "/products",
        data: payload,
        module: "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Omit<Product, 'id'>> & { id: string }) =>
      api<Partial<Omit<Product, 'id'>>, Product>({
        method: "PUT",
        endpoint: `/products/${id}`,
        data: payload,
        module: "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      api<void, void>({
        method: "DELETE",
        endpoint: `/products/${id}`,
        module: "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
