"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCompetitions } from "@/features/ai/api/getCompetitions";

const COMPETITIONS_PAGE_SIZE = 10;

export function useCompetitionsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ["competitions", "infinite"],
    queryFn: ({ pageParam }) =>
      getCompetitions({ page: pageParam, limit: COMPETITIONS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    placeholderData: keepPreviousData,
  });
}
