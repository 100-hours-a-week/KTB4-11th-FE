"use client";

import { useQuery } from "@tanstack/react-query";
import { getStockInfo } from "@/features/stock/api/getStockInfo";

export function useStockInfoQuery(stockCode?: string) {
  return useQuery({
    queryKey: ["stockInfo", stockCode],
    queryFn: () => getStockInfo(stockCode!),
    enabled: stockCode !== undefined,
  });
}
