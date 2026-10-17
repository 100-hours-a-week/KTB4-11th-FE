"use client";

import { useQuery } from "@tanstack/react-query";
import { getStockHolding } from "@/features/stock/api/getStockHolding";

export function useStockHoldingQuery(accountId?: number, stockCode?: string) {
  return useQuery({
    queryKey: ["stockHolding", accountId, stockCode],
    queryFn: () => getStockHolding(accountId!, stockCode!),
    enabled: accountId !== undefined && stockCode !== undefined,
  });
}
