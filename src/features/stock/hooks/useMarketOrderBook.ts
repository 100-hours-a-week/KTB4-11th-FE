"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderBooks } from "@/features/stock/api/getOrderBooks";
import type { MarketOrderBook } from "@/features/stock/types/market";
import { useEventSource } from "@/shared/hooks/useEventSource";

const MARKET_BASE_URL = process.env.NEXT_PUBLIC_MARKET_API_BASE_URL;

// REST로 최초 1회 조회 후 SSE로 실시간 갱신 (SSE 값이 오면 우선 사용)
export function useMarketOrderBook(stockCode?: string) {
  const { data: initialOrderBook, isLoading } = useQuery({
    queryKey: ["marketOrderBook", stockCode],
    queryFn: async () => (await getOrderBooks([stockCode!]))[0] ?? null,
    enabled: stockCode !== undefined,
  });

  const streamUrl = stockCode
    ? `${MARKET_BASE_URL}/orderbooks/stream?codes=${stockCode}`
    : null;
  const { data: liveOrderBook, status } = useEventSource<MarketOrderBook>(
    streamUrl,
    "orderbook",
  );

  const raw = liveOrderBook ?? initialOrderBook;
  const hasLevels = raw && (raw.asks.length > 0 || raw.bids.length > 0);
  const current = raw?.code === stockCode && hasLevels ? raw : null;

  // 서버 응답이 일시적으로 비면(SSE 재연결, 서버 재배포 직후, 장 마감 등) current가 null이 되는데,
  // 화면에서 기존 호가를 지워버리지 않도록 마지막으로 받은 값을 계속 기억해둠
  // (종목이 바뀌면 이전 종목의 호가를 들고 있으면 안 되기 때문에 같이 초기화)
  const [lastKnownOrderBook, setLastKnownOrderBook] =
    useState<MarketOrderBook | null>(null);
  const [lastStockCode, setLastStockCode] = useState(stockCode);
  let effectiveLastKnown = lastKnownOrderBook;
  if (stockCode !== lastStockCode) {
    setLastStockCode(stockCode);
    setLastKnownOrderBook(null);
    effectiveLastKnown = null;
  } else if (current && current !== lastKnownOrderBook) {
    setLastKnownOrderBook(current);
    effectiveLastKnown = current;
  }

  return {
    orderBook: current ?? effectiveLastKnown,
    // REST 최초 조회가 끝났는데도 데이터가 없으면 "로딩 중"이 아니라 "호가 없음"(장 마감 등)
    isLoading: stockCode !== undefined && isLoading,
    status,
  };
}
