import { apiClient } from "@/shared/lib/axios";
import type { CreateSearchHistoryResponse } from "@/features/stock/types/searchHistory";

export async function postSearchHistory(keyword: string) {
  const { data: createSearchHistoryResponse } =
    await apiClient.post<CreateSearchHistoryResponse>(
      "/api/v1/users/me/search-history",
      { keyword },
    );

  return createSearchHistoryResponse;
}
