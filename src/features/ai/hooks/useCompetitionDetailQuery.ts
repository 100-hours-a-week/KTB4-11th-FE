"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompetitionDetail } from "@/features/ai/api/getCompetitionDetail";
import { toDuelDetail } from "@/features/ai/utils/toDuelDetail";

export function useCompetitionDetailQuery(competitionId: string) {
  return useQuery({
    queryKey: ["competition", competitionId, "detail"],
    queryFn: async () => {
      const detail = await getCompetitionDetail(competitionId);
      return toDuelDetail(detail);
    },
  });
}
