import { apiClient } from "@/shared/lib/axios";

export async function deleteWatchlistItem(
  accountId: number,
  stockCode: string,
) {
  const { data } = await apiClient.delete(
    `/api/v1/accounts/${accountId}/watchlist/${stockCode}`,
  );

  return data;
}
