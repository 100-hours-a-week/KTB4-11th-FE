"use client";

import { useQuery } from "@tanstack/react-query";
import { getActiveUserVsAiCompetition } from "@/features/ai/api/getActiveUserVsAiCompetition";
import { toDuel } from "@/features/ai/utils/toDuel";

export function useActiveUserVsAiDuelQuery() {
  return useQuery({
    queryKey: ["competitions", "activeUserVsAi"],
    queryFn: async () => {
      const competition = await getActiveUserVsAiCompetition();
      return competition ? toDuel(competition) : null;
    },
  });
}
