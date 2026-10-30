"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSearchHistory } from "@/features/stock/api/deleteSearchHistory";

export function useDeleteSearchHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (searchId: number) => deleteSearchHistory(searchId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] }),
  });
}
