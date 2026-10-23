"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketPrices } from "@/features/stock/api/getMarketPrices";
import type { MarketPriceTick } from "@/features/stock/types/market";
import { useEventSource } from "@/shared/hooks/useEventSource";

const MARKET_BASE_URL = process.env.NEXT_PUBLIC_MARKET_API_BASE_URL;

// 같은 종목·거래일의 틱에서만 첫 응답의 상·하한가 유지
export function mergeMarketPrice(
  previous: MarketPriceTick | null,
  incoming: MarketPriceTick,
): MarketPriceTick {
  const tradingDay = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
  if (
    !previous ||
    previous.code !== incoming.code ||
    tradingDay(previous.timestamp) !== tradingDay(incoming.timestamp)
  )
    return incoming;
  return { ...previous, ...incoming };
}

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
  const { data: livePrice, status } = useEventSource<MarketPriceTick>(
    streamUrl,
    "price",
    mergeMarketPrice,
  );

  const initialForStock =
    initialPrice?.code === stockCode ? (initialPrice ?? null) : null;
  const liveForStock = livePrice?.code === stockCode ? livePrice : null;
  const price = liveForStock
    ? mergeMarketPrice(initialForStock, liveForStock)
    : initialForStock;
  return { price, status, isPending: price === null };
}
