"use client";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { deleteWatchlistItem } from "@/features/stock/api/deleteWatchlistItem";
import { postWatchlistItem } from "@/features/stock/api/postWatchlistItem";
import type { RankingApiResponse } from "@/features/stock/types/ranking";

interface ToggleFavoriteParams {
  stockCode: string;
  isFavorite: boolean;
}

function toggleInCache(
  data: InfiniteData<RankingApiResponse> | undefined,
  stockCode: string,
  nextIsFavorite: boolean,
) {
  if (!data) return data;

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      items: page.items.map((item) =>
        item.stock_code === stockCode
          ? { ...item, is_favorite: nextIsFavorite }
          : item,
      ),
    })),
  };
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stockCode, isFavorite }: ToggleFavoriteParams) =>
      isFavorite
        ? deleteWatchlistItem(stockCode)
        : postWatchlistItem(stockCode),
    onMutate: async ({ stockCode, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ["ranking"] });

      const previous = queryClient.getQueriesData<
        InfiniteData<RankingApiResponse>
      >({ queryKey: ["ranking"] });

      previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(
          queryKey,
          toggleInCache(data, stockCode, !isFavorite),
        );
      });

      return { previous };
    },
    onError: (_error, _variables, context) => {
      context?.previous.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
