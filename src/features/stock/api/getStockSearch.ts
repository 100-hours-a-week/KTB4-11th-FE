import { marketApiClient } from "@/shared/lib/marketApiClient";
import type { StockSearchResponse } from "@/features/stock/types/stockSearch";

export async function getStockSearch(keyword: string, signal?: AbortSignal) {
  const { data: stockSearchResponse } =
    await marketApiClient.get<StockSearchResponse>("/stocks/search", {
      params: { q: keyword },
      signal,
    });

  return stockSearchResponse;
}
