import { apiClient } from "@/shared/lib/axios";

export async function postWatchlistItem(stockCode: string) {
  const { data } = await apiClient.post("/api/v2/users/me/watchlist", {
    stock_code: stockCode,
  });

  return data;
}
