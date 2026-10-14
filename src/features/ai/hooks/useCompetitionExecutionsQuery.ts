"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompetitionExecutions } from "@/features/ai/api/getCompetitionExecutions";

export function useCompetitionExecutionsQuery(accountId?: number) {
  return useQuery({
    queryKey: ["competitionExecutions", accountId],
    queryFn: () => getCompetitionExecutions(accountId!),
    enabled: accountId !== undefined,
  });
}
