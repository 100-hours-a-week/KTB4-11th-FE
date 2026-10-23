"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketPrices } from "@/features/stock/api/getMarketPrices";
import type { MarketPriceTick } from "@/features/stock/types/market";
import { useEventSource } from "@/shared/hooks/useEventSource";
import { mergeMarketPrice } from "@/features/stock/utils/mergeMarketPrice";

const MARKET_BASE_URL = process.env.NEXT_PUBLIC_MARKET_API_BASE_URL;
type PricesByCode = Record<string, MarketPriceTick>;

export function mergeMarketPrices(
  previous: PricesByCode | null,
  incoming: MarketPriceTick,
): PricesByCode {
  const existing = previous?.[incoming.code];
  if (
    existing &&
    Date.parse(existing.timestamp) > Date.parse(incoming.timestamp)
  )
    return previous!;
  return {
    ...previous,
    [incoming.code]: mergeMarketPrice(existing ?? null, incoming),
  };
}

// 최초 시세를 일괄 조회하고 하나의 SSE 연결로 종목별 최신 시세를 유지
export function useMarketPrices(stockCodes: string[]) {
  const codes = [...new Set(stockCodes)].sort().join(",");
  const { data: initialPrices } = useQuery({
    queryKey: ["marketPrices", codes],
    queryFn: () => getMarketPrices(codes.split(",")),
    enabled: codes.length > 0,
  });
  const streamUrl =
    codes && MARKET_BASE_URL
      ? `${MARKET_BASE_URL}/prices/stream?codes=${codes}`
      : null;
  const { data: livePrices, status } = useEventSource<
    PricesByCode,
    MarketPriceTick
  >(streamUrl, "price", mergeMarketPrices);

  const prices: PricesByCode = {};
  for (const price of initialPrices ?? []) prices[price.code] = price;
  for (const code of codes ? codes.split(",") : []) {
    const live = livePrices?.[code];
    const initial = prices[code];
    if (
      live &&
      (!initial || Date.parse(live.timestamp) >= Date.parse(initial.timestamp))
    )
      prices[code] = mergeMarketPrice(initial ?? null, live);
  }
  return { prices, status };
}
