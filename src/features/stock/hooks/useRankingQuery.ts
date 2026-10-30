"use client";

// 스크롤 시 조회 개수를 늘리고, polling 응답으로 목록 전체 교체
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRanking } from "@/features/stock/api/getRanking";
import {
  RANKING_BATCH_SIZE,
  RANKING_MAX_LIMIT,
  RANKING_TYPE_TO_API_TYPE,
  type RankingApiResponse,
  type RankingType,
} from "@/features/stock/types/ranking";

export function useRankingQuery(rankingType: RankingType) {
  const type = RANKING_TYPE_TO_API_TYPE[rankingType];
  const maxLimit = type === "popular" ? RANKING_BATCH_SIZE : RANKING_MAX_LIMIT;
  const [limits, setLimits] = useState<Partial<Record<RankingType, number>>>(
    {},
  );
  const limit = limits[rankingType] ?? RANKING_BATCH_SIZE;
  const query = useQuery({
    queryKey: ["ranking", type, limit],
    queryFn: ({ signal }) => getRanking({ type, limit, signal }),
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[1] === type ? previous : undefined,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });

  // 추가 조회나 polling 실패 시에도 같은 종류의 마지막 정상 목록 유지
  const [snapshots, setSnapshots] = useState<
    Partial<
      Record<
        RankingType,
        {
          data: RankingApiResponse;
          limit: number;
        }
      >
    >
  >({});
  const saved = snapshots[rankingType];
  if (query.data && !query.isPlaceholderData && query.data !== saved?.data) {
    setSnapshots({ ...snapshots, [rankingType]: { data: query.data, limit } });
  }
  const data = query.data ?? saved?.data;
  const displayedLimit =
    query.data && !query.isPlaceholderData
      ? limit
      : (saved?.limit ?? RANKING_BATCH_SIZE);
  const hasMore = Boolean(
    data && data.items.length >= displayedLimit && displayedLimit < maxLimit,
  );

  function loadMore() {
    if (!hasMore || query.isFetching) return;
    if (query.isError) {
      void query.refetch();
      return;
    }
    setLimits((current) => ({
      ...current,
      [rankingType]: Math.min(displayedLimit + RANKING_BATCH_SIZE, maxLimit),
    }));
  }

  return {
    data,
    isPending: !data && query.isPending,
    isError: query.isError,
    isFetching: query.isFetching,
    isFetchingMore: query.isFetching && limit > displayedLimit,
    hasMore,
    loadMore,
    refetch: query.refetch,
  };
}
