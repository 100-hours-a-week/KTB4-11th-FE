import { marketApiClient } from "@/shared/lib/marketApiClient";
import type { StockSearchResponse } from "@/features/stock/types/stockSearch";

const STOCK_SEARCH_SIZE = 30;

export async function getStockSearch(keyword: string, signal?: AbortSignal) {
  const { data: stockSearchResponse } =
    await marketApiClient.get<StockSearchResponse>("/stocks", {
      params: { q: keyword, size: STOCK_SEARCH_SIZE },
      signal,
    });

  return stockSearchResponse;
}
