import { apiClient } from "@/shared/lib/axios";

export async function deleteSearchHistory(searchId: number) {
  const { data: deleteSearchHistoryResponse } = await apiClient.delete(
    `/api/v1/users/me/search-history/${searchId}`,
  );

  return deleteSearchHistoryResponse;
}
