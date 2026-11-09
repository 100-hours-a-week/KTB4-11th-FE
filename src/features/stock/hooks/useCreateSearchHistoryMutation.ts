"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSearchHistory } from "@/features/stock/api/postSearchHistory";

export function useCreateSearchHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyword: string) => postSearchHistory(keyword),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] }),
  });
}
