"use client";

import { toast } from "sonner";
import { useSearchHistoryQuery } from "@/features/stock/hooks/useSearchHistoryQuery";
import { useCreateSearchHistoryMutation } from "@/features/stock/hooks/useCreateSearchHistoryMutation";
import { useDeleteSearchHistoryMutation } from "@/features/stock/hooks/useDeleteSearchHistoryMutation";

const MAX_RECENT_SEARCHES = 10;

export function useRecentSearches() {
  const { data } = useSearchHistoryQuery();
  const createMutation = useCreateSearchHistoryMutation();
  const deleteMutation = useDeleteSearchHistoryMutation();

  const recentSearches = [...(data?.search_history ?? [])]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, MAX_RECENT_SEARCHES);

  function addRecentSearch(keyword: string) {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    createMutation.mutate(trimmed);
  }

  function removeRecentSearch(searchId: number) {
    deleteMutation.mutate(searchId, {
      onError: () => toast.error("최근 검색어 삭제에 실패했어요"),
    });
  }

  function clearRecentSearches() {
    for (const item of recentSearches)
      deleteMutation.mutate(item.search_id, {
        onError: () => toast.error("최근 검색어 삭제에 실패했어요"),
      });
  }

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  };
}
