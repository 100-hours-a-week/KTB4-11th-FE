// 선택한 봉의 비교 기준 가격과 이동평균·거래량 평균 계산

import type { Bar } from "@/features/stock/types/chart";
import { MOVING_AVERAGES } from "@/features/stock/utils/chart/stockChart";

export interface ChartSelection {
  bar: Bar;
  baseline: number;
  averages: { period: number; color: string; value: number | null }[];
  volumeAverage: number | null;
}

export function getChartSelection(bars: Bar[], index: number): ChartSelection {
  const mean = (period: number, field: "close" | "volume") =>
    index + 1 < period
      ? null
      : bars
          .slice(index + 1 - period, index + 1)
          .reduce((sum, bar) => sum + bar[field], 0) / period;
  return {
    bar: bars[index],
    baseline: bars[Math.max(0, index - 1)].close,
    averages: MOVING_AVERAGES.map(({ period, color }) => ({
      period,
      color,
      value: mean(period, "close"),
    })),
    volumeAverage: mean(20, "volume"),
  };
}
