import { apiClient } from "@/shared/lib/axios";
import type { SearchHistoryResponse } from "@/features/stock/types/searchHistory";

export async function getSearchHistory() {
  const { data: searchHistoryResponse } =
    await apiClient.get<SearchHistoryResponse>(
      "/api/v1/users/me/search-history",
    );

  return searchHistoryResponse;
}
