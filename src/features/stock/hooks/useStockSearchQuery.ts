"use client";

import { useQuery } from "@tanstack/react-query";
import { getStockSearch } from "@/features/stock/api/getStockSearch";

export function useStockSearchQuery(keyword: string) {
  const trimmed = keyword.trim();
  const query = useQuery({
    queryKey: ["stockSearch", trimmed],
    queryFn: ({ signal }) => getStockSearch(trimmed, signal),
    enabled: trimmed.length > 0,
  });

  return {
    stocks: query.data?.stocks ?? [],
    isPending: query.isPending && trimmed.length > 0,
    isError: query.isError,
    refetch: query.refetch,
  };
}
