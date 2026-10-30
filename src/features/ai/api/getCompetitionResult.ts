import { apiClient } from "@/shared/lib/axios";
import type { CompetitionResultResponse } from "@/features/ai/types/duel";

export async function getCompetitionResult(competitionId: string) {
  const { data: competitionResult } =
    await apiClient.get<CompetitionResultResponse>(
      `/api/v2/users/me/competitions/${competitionId}/result`,
    );

  return competitionResult;
}
