"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () =>
      api<void, Category[]>({
        method: "GET",
        endpoint: "/categories",
        module: "",
        skipAuth: true,
      }),
  });
}

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: async (payload: CreateCategoryRequest) =>
      api<CreateCategoryRequest, Category>({
        method: "POST",
        endpoint: "/categories",
        data: payload,
        module: "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      api<{ name: string }, Category>({
        method: "PUT",
        endpoint: `/categories/${id}`,
        data: { name },
        module: "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      api<void, void>({
        method: "DELETE",
        endpoint: `/categories/${id}`,
        module: "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
