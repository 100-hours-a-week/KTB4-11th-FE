import { apiClient } from "@/shared/lib/axios";
import type { StockSearchResponse } from "@/features/stock/types/stockSearch";

export async function getStockSearch(keyword: string, signal?: AbortSignal) {
  const { data: stockSearchResponse } =
    await apiClient.get<StockSearchResponse>("/api/v1/search", {
      params: { keyword },
      signal,
    });

  return stockSearchResponse;
}
