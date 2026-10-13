import { apiClient } from "@/shared/lib/axios";
import type { CompetitionsResponse } from "@/features/ai/types/duel";

export async function getCompetitions() {
  const { data: competitionsResponse } =
    await apiClient.get<CompetitionsResponse>("/api/v1/users/me/competitions");

  return competitionsResponse;
}
