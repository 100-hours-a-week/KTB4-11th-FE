"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getRanking } from "@/features/stock/api/getRanking";
import {
  RANKING_TYPE_TO_API_TYPE,
  type RankingType,
} from "@/features/stock/types/ranking";

export function useRankingQuery(rankingType: RankingType) {
  const type = RANKING_TYPE_TO_API_TYPE[rankingType];

  return useInfiniteQuery({
    queryKey: ["ranking", type],
    queryFn: ({ pageParam }) => getRanking({ type, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.page + 1 : undefined,
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
}
