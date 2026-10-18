// 차트 기간·봉 간격 목록과 API 조회 설정

import type {
  BarTimeframe,
  BarAggregateUnit,
} from "@/features/stock/types/chart";
import type { ChartPeriod } from "@/features/stock/types/stockDetail";

export const CHART_MINUTES = [
  "1분",
  "3분",
  "5분",
  "10분",
  "15분",
  "30분",
  "60분",
  "120분",
  "240분",
] as const;
export type ChartMinute = (typeof CHART_MINUTES)[number];
export const CHART_GRANULARITIES = ["일", "주", "월", "년"] as const;
export type ChartGranularity =
  ChartMinute | (typeof CHART_GRANULARITIES)[number];
export function isMinuteChart(value: string): value is ChartMinute {
  return (CHART_MINUTES as readonly string[]).includes(value);
}

export interface BarsRequestConfig {
  timeframe: BarTimeframe;
  minCount: number;
  aggregateUnit?: BarAggregateUnit;
  period?: ChartPeriod;
  aggregateMinutes?: number;
}

export function getSimpleChartConfig(period: ChartPeriod): BarsRequestConfig {
  switch (period) {
    case "1일":
      return { timeframe: "1m", minCount: 400, period };
    case "1주":
      return { timeframe: "15m", minCount: 150, period };
    case "3달":
      return { timeframe: "1d", minCount: 70, period };
    case "1년":
      return { timeframe: "1d", minCount: 260, period };
    case "전체":
      return { timeframe: "1d", minCount: 260, period };
  }
}

export function getDetailedChartConfig(
  granularity: ChartGranularity,
): BarsRequestConfig {
  if (isMinuteChart(granularity)) {
    const minutes = Number.parseInt(granularity);
    const sourceMinutes = minutes >= 60 ? 60 : minutes >= 15 ? 15 : 1;
    return {
      timeframe:
        sourceMinutes === 60 ? "1h" : sourceMinutes === 15 ? "15m" : "1m",
      minCount: 1000,
      aggregateMinutes: minutes,
    };
  }
  switch (granularity) {
    case "일":
      return { timeframe: "1d", minCount: 260, period: "1년" };
    case "주":
      return {
        timeframe: "1d",
        minCount: 260,
        period: "1년",
        aggregateUnit: "week",
      };
    case "월":
      return {
        timeframe: "1d",
        minCount: 260,
        period: "1년",
        aggregateUnit: "month",
      };
    case "년":
      return {
        timeframe: "1d",
        minCount: 260,
        period: "1년",
        aggregateUnit: "year",
      };
  }
}
