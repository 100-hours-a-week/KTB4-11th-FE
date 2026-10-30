import { apiClient } from "@/shared/lib/axios";
import type { CompetitionDetailResponse } from "@/features/ai/types/duel";

export async function getCompetitionDetail(competitionId: string) {
  const { data: competitionDetail } =
    await apiClient.get<CompetitionDetailResponse>(
      `/api/v2/users/me/competitions/${competitionId}`,
    );

  return competitionDetail;
}
