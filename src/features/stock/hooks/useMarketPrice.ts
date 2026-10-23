"use client";

import { useMarketPrices } from "@/features/stock/hooks/useMarketPrices";

// 단일 종목도 목록과 동일한 REST 조회·SSE 갱신 로직을 사용
export function useMarketPrice(stockCode?: string) {
  const { prices, status } = useMarketPrices(stockCode ? [stockCode] : []);
  const price = stockCode ? (prices[stockCode] ?? null) : null;
  return { price, status, isPending: price === null };
}
