"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompetitionDetail } from "@/features/ai/api/getCompetitionDetail";
import { toAiVsAiDuelDetail } from "@/features/ai/utils/toAiVsAiDuelDetail";

export function useAiVsAiDuelDetailQuery(competitionId: string) {
  return useQuery({
    queryKey: ["competition", competitionId, "detail"],
    refetchInterval: (query) =>
      query.state.data?.state === "ready" ? 30_000 : false,
    queryFn: async () => {
      const detail = await getCompetitionDetail(competitionId);
      return toAiVsAiDuelDetail(detail);
    },
  });
}
