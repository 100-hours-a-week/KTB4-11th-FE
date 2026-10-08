import { apiClient } from "@/shared/lib/axios";

export async function postWatchlistItem(accountId: number, stockCode: string) {
  const { data } = await apiClient.post(
    `/api/v1/accounts/${accountId}/watchlist`,
    { account_id: accountId, stock_code: stockCode },
  );

  return data;
}
