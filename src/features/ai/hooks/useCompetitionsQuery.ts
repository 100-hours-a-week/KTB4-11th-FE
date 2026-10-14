"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompetitions } from "@/features/ai/api/getCompetitions";
import { toDuel } from "@/features/ai/utils/toDuel";

export function useCompetitionsQuery() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: async () => {
      const { competitions } = await getCompetitions();
      return competitions.map(toDuel);
    },
  });
}
