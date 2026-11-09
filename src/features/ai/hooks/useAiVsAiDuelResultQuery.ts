"use client";

import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCompetitionResult } from "@/features/ai/api/getCompetitionResult";
import { toAiVsAiDuelResult } from "@/features/ai/utils/toAiVsAiDuelResult";

export function useAiVsAiDuelResultQuery(competitionId: string) {
  return useQuery({
    queryKey: ["competition", competitionId, "result"],
    retry: (failureCount, error) => {
      if (isAxiosError(error) && error.response?.status === 409) return false;
      return failureCount < 1;
    },
    queryFn: async () => {
      const result = await getCompetitionResult(competitionId);
      return toAiVsAiDuelResult(result);
    },
  });
}
