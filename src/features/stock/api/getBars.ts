// 필요한 기간의 차트 데이터를 여러 번 나눠서 조회

import { marketApiClient } from "@/shared/lib/marketApiClient";
import type { Bar, BarsPage, BarTimeframe } from "@/features/stock/types/chart";
import type { ChartPeriod } from "@/features/stock/types/stockDetail";
import { periodStart } from "@/features/stock/utils/chart/stockChart";

// 기간 조회에 등락 비교용 직전 봉도 포함
export async function getBars(
  stockCode: string,
  timeframe: BarTimeframe,
  minCount: number,
  period?: ChartPeriod,
  signal?: AbortSignal,
): Promise<Bar[]> {
  const unique = new Map<string, Bar>();
  const seen = new Set<string>();
  let cursor: string | undefined;
  let start = -Infinity;
  while (true) {
    const { data } = await marketApiClient.get<BarsPage>(`/bars/${stockCode}`, {
      params: { timeframe, limit: 1000, cursor },
      signal,
    });
    for (const bar of data.items) unique.set(bar.timestamp, bar);
    const sorted = [...unique.values()].sort(
      (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
    );
    if (period && sorted.length)
      start = periodStart(sorted[sorted.length - 1].timestamp, period);
    const hasRange =
      period && sorted.length && Date.parse(sorted[0].timestamp) < start;
    if (
      !data.next_cursor ||
      !data.items.length ||
      hasRange ||
      (!period && unique.size >= minCount)
    )
      return sorted;
    if (seen.has(data.next_cursor))
      throw new Error("차트 조회 커서가 반복돼요. 다시 시도해 주세요.");
    seen.add(data.next_cursor);
    cursor = data.next_cursor;
  }
}
