import { apiClient } from "@/shared/lib/axios";
import type { CompetitionNameAvailabilityResponse } from "@/features/ai/types/duel";

export async function getCompetitionNameAvailability(competitionName: string) {
  const { data: nameAvailabilityResponse } =
    await apiClient.get<CompetitionNameAvailabilityResponse>(
      "/api/v2/users/me/competitions/name-availability",
      { params: { competition_name: competitionName } },
    );

  return nameAvailabilityResponse;
}
