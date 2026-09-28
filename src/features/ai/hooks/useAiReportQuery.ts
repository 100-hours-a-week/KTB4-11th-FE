"use client";

import { useQuery } from "@tanstack/react-query";
import { getAiReport } from "@/features/ai/api/getAiReport";

export function useAiReportQuery(accountId?: number, orderId?: number) {
  return useQuery({
    queryKey: ["ai-report", accountId, orderId],
    queryFn: () => getAiReport(accountId!, orderId!),
    enabled: accountId !== undefined && orderId !== undefined,
  });
}
