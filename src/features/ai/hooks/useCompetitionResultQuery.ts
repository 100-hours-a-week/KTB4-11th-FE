"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompetitionResult } from "@/features/ai/api/getCompetitionResult";
import { toDuelResultSummary } from "@/features/ai/utils/toDuelResult";

export function useCompetitionResultQuery(competitionId: string) {
  return useQuery({
    queryKey: ["competition", competitionId, "result"],
    queryFn: async () => {
      const result = await getCompetitionResult(competitionId);
      return toDuelResultSummary(result);
    },
  });
}
