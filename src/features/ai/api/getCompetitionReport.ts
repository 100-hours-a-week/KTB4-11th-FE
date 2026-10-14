import { apiClient } from "@/shared/lib/axios";
import type { CompetitionReportResponse } from "@/features/ai/types/duel";

export async function getCompetitionReport(competitionId: string) {
  const { data: competitionReport } =
    await apiClient.get<CompetitionReportResponse>(
      `/api/v2/users/me/competitions/${competitionId}/report`,
    );

  return competitionReport;
}
