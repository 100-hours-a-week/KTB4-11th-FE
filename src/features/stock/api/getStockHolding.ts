import { apiClient } from "@/shared/lib/axios";
import type { StockHoldingResponse } from "@/features/stock/types/stockDetail";

export async function getStockHolding(accountId: number, stockCode: string) {
  const { data: holdingResponse } = await apiClient.get<StockHoldingResponse>(
    `/api/v1/accounts/${accountId}/holdings/${stockCode}`,
  );

  return holdingResponse;
}
