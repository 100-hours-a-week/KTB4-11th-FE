"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWatchlistItem } from "@/features/stock/api/deleteWatchlistItem";
import { postWatchlistItem } from "@/features/stock/api/postWatchlistItem";

interface ToggleWatchlistParams {
  stockCode: string;
  isFavorite: boolean;
}

export function useToggleWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stockCode, isFavorite }: ToggleWatchlistParams) =>
      isFavorite
        ? deleteWatchlistItem(stockCode)
        : postWatchlistItem(stockCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
