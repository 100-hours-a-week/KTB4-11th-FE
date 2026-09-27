import { apiClient } from "@/shared/lib/axios";
import type { AiReportResponse } from "@/features/ai/types/aiTradeReasoning";

export async function getAiReport(accountId: number, orderId: number) {
  const { data: aiReportResponse } = await apiClient.get<AiReportResponse>(
    `/api/v1/accounts/${accountId}/orders/${orderId}/ai-report`,
  );

  return aiReportResponse;
}
