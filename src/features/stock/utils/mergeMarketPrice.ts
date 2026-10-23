import type { MarketPriceTick } from "@/features/stock/types/market";

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
