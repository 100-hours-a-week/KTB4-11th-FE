"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketPrices } from "@/features/stock/api/getMarketPrices";
import { getStockHolding } from "@/features/stock/api/getStockHolding";
import { toStockHolding } from "@/features/stock/utils/toStockHolding";

// 내 주식 진입 시 보유 정보와 REST 현재가를 함께 조회해 평가 현황을 고정한다.
export function useStockHoldingValuationQuery(
  accountId: number | undefined,
  stockCode: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["stockHolding", accountId, stockCode, "valuation"],
    queryFn: async () => {
      const [holding, prices] = await Promise.all([
        getStockHolding(accountId!, stockCode),
        getMarketPrices([stockCode]),
      ]);
      const price = prices.find((item) => item.code === stockCode)?.price;
      if (price === undefined || !Number.isFinite(price) || price <= 0) {
        throw new Error("보유 현황을 계산할 현재가가 없어요");
      }
      return toStockHolding(holding, price);
    },
    enabled: enabled && accountId !== undefined,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
