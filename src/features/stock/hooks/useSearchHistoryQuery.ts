"use client";

import { useQuery } from "@tanstack/react-query";
import { getSearchHistory } from "@/features/stock/api/getSearchHistory";

export function useSearchHistoryQuery() {
  return useQuery({
    queryKey: ["searchHistory"],
    queryFn: getSearchHistory,
  });
}
