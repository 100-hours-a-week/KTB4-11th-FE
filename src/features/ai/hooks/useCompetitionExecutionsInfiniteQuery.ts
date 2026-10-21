"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCompetitionExecutions } from "@/features/ai/api/getCompetitionExecutions";
import { toDuelTrade } from "@/features/ai/utils/toDuelTrade";

const EXECUTIONS_PAGE_SIZE = 10;

export function useCompetitionExecutionsInfiniteQuery(accountId?: number) {
  return useInfiniteQuery({
    queryKey: ["competitionExecutions", "infinite", accountId],
    queryFn: async ({ pageParam }) => {
      const response = await getCompetitionExecutions(accountId!, {
        limit: EXECUTIONS_PAGE_SIZE,
        cursor: pageParam,
      });
      return {
        ...response,
        trades: response.executions.map(toDuelTrade),
      };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next
        ? (lastPage.pagination.next_cursor ?? undefined)
        : undefined,
    enabled: accountId !== undefined,
    placeholderData: keepPreviousData,
  });
}
