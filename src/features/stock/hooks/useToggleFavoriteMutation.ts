"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWatchlistItem } from "@/features/stock/api/deleteWatchlistItem";
import { postWatchlistItem } from "@/features/stock/api/postWatchlistItem";
import type {
  WatchlistItem,
  WatchlistResponse,
} from "@/features/stock/types/watchlist";

interface ToggleFavoriteParams {
  stockCode: string;
  isFavorite: boolean;
  stock?: WatchlistItem;
}

// 관심 목록 캐시를 갱신해 랭킹·관심 화면에서 동일한 좋아요 상태 사용
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["toggleFavorite"],
    mutationFn: ({ stockCode, isFavorite }: ToggleFavoriteParams) =>
      isFavorite
        ? deleteWatchlistItem(stockCode)
        : postWatchlistItem(stockCode),
    onMutate: async ({ stockCode, isFavorite, stock }) => {
      await queryClient.cancelQueries({ queryKey: ["watchlist"] });
      const previous = queryClient.getQueryData<WatchlistResponse>([
        "watchlist",
      ]);
      if (previous) {
        queryClient.setQueryData<WatchlistResponse>(["watchlist"], {
          ...previous,
          watchlists: isFavorite
            ? previous.watchlists.filter(
                (item) => item.stock_code !== stockCode,
              )
            : stock &&
                !previous.watchlists.some(
                  (item) => item.stock_code === stockCode,
                )
              ? [...previous.watchlists, stock]
              : previous.watchlists,
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(["watchlist"], context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["watchlist"] }),
  });
}
