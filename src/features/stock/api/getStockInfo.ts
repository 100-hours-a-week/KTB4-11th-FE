import { apiClient } from "@/shared/lib/axios";
import type { StockInfoResponse } from "@/features/stock/types/stockDetail";

export async function getStockInfo(stockCode: string) {
  const { data: stockInfoResponse } = await apiClient.get<StockInfoResponse>(
    `/api/v2/stocks/${stockCode}`,
  );

  return stockInfoResponse;
}
