"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCompetitionExecutions } from "@/features/ai/api/getCompetitionExecutions";

const EXECUTIONS_PAGE_SIZE = 10;

export function useCompetitionExecutionsInfiniteQuery(accountId?: number) {
  return useInfiniteQuery({
    queryKey: ["competitionExecutions", "infinite", accountId],
    queryFn: ({ pageParam }) =>
      getCompetitionExecutions(accountId!, {
        page: pageParam,
        limit: EXECUTIONS_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    enabled: accountId !== undefined,
    placeholderData: keepPreviousData,
  });
}
