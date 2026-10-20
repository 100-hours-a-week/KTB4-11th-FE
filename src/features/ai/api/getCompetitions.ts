import { apiClient } from "@/shared/lib/axios";
import type { CompetitionsResponse } from "@/features/ai/types/duel";

interface GetCompetitionsParams {
  page?: number;
  limit?: number;
}

export async function getCompetitions(params: GetCompetitionsParams = {}) {
  const { data: competitionsResponse } =
    await apiClient.get<CompetitionsResponse>("/api/v2/users/me/competitions", {
      params,
    });

  return competitionsResponse;
}
