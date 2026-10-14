import { apiClient } from "@/shared/lib/axios";
import type { CompetitionExecutionsResponse } from "@/features/ai/types/duel";

export async function getCompetitionExecutions(accountId: number) {
  const { data: executionsResponse } =
    await apiClient.get<CompetitionExecutionsResponse>(
      `/api/v2/accounts/${accountId}/executions`,
    );

  return executionsResponse;
}
