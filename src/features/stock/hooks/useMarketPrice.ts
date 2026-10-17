"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketPrices } from "@/features/stock/api/getMarketPrices";
import type { MarketPrice } from "@/features/stock/types/market";
import { useEventSource } from "@/shared/hooks/useEventSource";

const MARKET_BASE_URL = process.env.NEXT_PUBLIC_MARKET_API_BASE_URL;

// REST로 최초 1회 조회 후 SSE로 실시간 갱신 (SSE 값이 오면 우선 사용)
export function useMarketPrice(stockCode?: string) {
  const { data: initialPrice } = useQuery({
    queryKey: ["marketPrice", stockCode],
    queryFn: async () => (await getMarketPrices([stockCode!]))[0] ?? null,
    enabled: stockCode !== undefined,
  });

  const streamUrl = stockCode
    ? `${MARKET_BASE_URL}/prices/stream?codes=${stockCode}`
    : null;
  const { data: livePrice, status } = useEventSource<MarketPrice>(
    streamUrl,
    "price",
  );

  return { price: livePrice ?? initialPrice ?? null, status };
}
