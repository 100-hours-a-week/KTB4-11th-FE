import { apiClient } from "@/shared/lib/axios";

export async function deleteWatchlistItem(stockCode: string) {
  const { data } = await apiClient.delete(
    `/api/v2/users/me/watchlist/${stockCode}`,
  );

  return data;
}
