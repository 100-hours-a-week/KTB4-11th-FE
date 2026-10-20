import { apiClient } from "@/shared/lib/axios";
import type { CompetitionExecutionsResponse } from "@/features/ai/types/duel";

interface GetCompetitionExecutionsParams {
  page?: number;
  limit?: number;
}

export async function getCompetitionExecutions(
  accountId: number,
  params: GetCompetitionExecutionsParams = {},
) {
  const { data: executionsResponse } =
    await apiClient.get<CompetitionExecutionsResponse>(
      `/api/v2/accounts/${accountId}/executions`,
      { params },
    );

  return executionsResponse;
}
