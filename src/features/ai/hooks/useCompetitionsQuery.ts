"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCompetitions,
  type GetCompetitionsParams,
} from "@/features/ai/api/getCompetitions";
import { toDuel } from "@/features/ai/utils/toDuel";

export function useCompetitionsQuery(params?: GetCompetitionsParams) {
  return useQuery({
    queryKey: ["competitions", params],
    queryFn: async () => {
      const { competitions } = await getCompetitions(params);
      return competitions.map(toDuel);
    },
  });
}
