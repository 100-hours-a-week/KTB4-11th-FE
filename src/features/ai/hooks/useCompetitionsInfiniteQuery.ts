"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCompetitions } from "@/features/ai/api/getCompetitions";
import { toDuel } from "@/features/ai/utils/toDuel";

const COMPETITIONS_PAGE_SIZE = 10;

export function useCompetitionsInfiniteQuery(
  state?: "in_progress" | "completed",
) {
  return useInfiniteQuery({
    queryKey: ["competitions", "infinite", state],
    queryFn: async ({ pageParam }) => {
      const response = await getCompetitions({
        state,
        limit: COMPETITIONS_PAGE_SIZE,
        cursor: pageParam,
      });
      return {
        ...response,
        duels: response.competitions.map(toDuel),
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next
        ? (lastPage.pagination.next_cursor ?? undefined)
        : undefined,
    placeholderData: keepPreviousData,
  });
}
