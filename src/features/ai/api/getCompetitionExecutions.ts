import { apiClient } from "@/shared/lib/axios";
import type { CompetitionExecutionsResponse } from "@/features/ai/types/duel";

export interface GetCompetitionExecutionsParams {
  orderSide?: "buy" | "sell";
  limit?: number;
  cursor?: string;
}

export async function getCompetitionExecutions(
  accountId: number,
  { orderSide, limit, cursor }: GetCompetitionExecutionsParams = {},
) {
  const { data: executionsResponse } =
    await apiClient.get<CompetitionExecutionsResponse>(
      `/api/v2/accounts/${accountId}/executions`,
      { params: { order_side: orderSide, limit, cursor } },
    );

  return executionsResponse;
}
