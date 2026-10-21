"use client";

// 봉 데이터 조회·캐시 갱신과 선택 간격별 집계 연결

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBars } from "@/features/stock/api/getBars";
import type { Bar } from "@/features/stock/types/chart";
import type { BarsRequestConfig } from "@/features/stock/utils/chart/chartPeriod";
import {
  aggregateBars,
  aggregateMinuteBars,
} from "@/features/stock/utils/chart/aggregateBars";

export function useStockBarsQuery(
  stockCode: string,
  {
    timeframe,
    minCount,
    aggregateUnit,
    aggregateMinutes,
    period,
  }: BarsRequestConfig,
  enabled = true,
) {
  const client = useQueryClient();
  const queryKey = ["bars", stockCode, timeframe, minCount, period];
  const query = useQuery({
    queryKey,
    enabled,
    refetchInterval: 60_000,
    queryFn: async ({ signal }) => {
      const cached = client.getQueryData<Bar[]>(queryKey);
      // 첫 조회는 필요한 기간까지, 갱신할 때는 최근 페이지부터 병합
      const recent = await getBars(
        stockCode,
        timeframe,
        cached?.length ? 1000 : minCount,
        cached?.length ? undefined : period,
        signal,
      );
      const merged = new Map((cached ?? []).map((bar) => [bar.timestamp, bar]));
      for (const bar of recent) merged.set(bar.timestamp, bar);
      return [...merged.values()].sort(
        (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
      );
    },
  });
  const data = useMemo(
    () =>
      query.data &&
      (aggregateUnit
        ? aggregateBars(query.data, aggregateUnit)
        : aggregateMinutes
          ? aggregateMinuteBars(query.data, aggregateMinutes)
          : query.data),
    [query.data, aggregateUnit, aggregateMinutes],
  );
  return { ...query, data };
}
