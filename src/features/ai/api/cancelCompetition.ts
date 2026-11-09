import { apiClient } from "@/shared/lib/axios";
import type { CancelCompetitionResponse } from "@/features/ai/types/duel";

export async function cancelCompetition(competitionId: number) {
  const { data: cancelCompetitionResponse } =
    await apiClient.post<CancelCompetitionResponse>(
      `/api/v2/users/me/competitions/${competitionId}/cancel`,
    );

  return cancelCompetitionResponse;
}
