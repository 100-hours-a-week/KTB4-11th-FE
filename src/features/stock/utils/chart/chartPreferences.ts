// 차트 설정 검증과 URL 우선순위 처리, 종목 간 확대·이동 범위 변환

import type { LogicalRange } from "lightweight-charts";
import {
  CHART_PERIODS,
  type ChartPeriod,
} from "@/features/stock/types/stockDetail";
import {
  CHART_GRANULARITIES,
  isMinuteChart,
  type ChartGranularity,
  type ChartMinute,
} from "@/features/stock/utils/chart/chartPeriod";

export interface ChartPreferences {
  detailed: boolean;
  period: ChartPeriod;
  granularity: ChartGranularity;
  minute: ChartMinute;
}

export interface SavedChartViewport {
  visibleBars: number;
  rightOffset: number;
}

export const DEFAULT_CHART_PREFERENCES: ChartPreferences = {
  detailed: false,
  period: "1일",
  granularity: "일",
  minute: "60분",
};

export function isChartGranularity(value: unknown): value is ChartGranularity {
  return (
    typeof value === "string" &&
    (isMinuteChart(value) ||
      CHART_GRANULARITIES.some((option) => option === value))
  );
}

export function parseChartPreferences(value: unknown): ChartPreferences {
  const saved = (value ?? {}) as Partial<ChartPreferences>;
  return {
    detailed: typeof saved.detailed === "boolean" ? saved.detailed : false,
    period: CHART_PERIODS.find((option) => option === saved.period) ?? "1일",
    granularity: isChartGranularity(saved.granularity)
      ? saved.granularity
      : "일",
    minute:
      typeof saved.minute === "string" && isMinuteChart(saved.minute)
        ? saved.minute
        : "60분",
  };
}

export function isSavedChartViewport(
  value: unknown,
): value is SavedChartViewport {
  if (!value || typeof value !== "object") return false;
  const saved = value as SavedChartViewport;
  return (
    Number.isFinite(saved.visibleBars) &&
    saved.visibleBars > 0 &&
    Number.isFinite(saved.rightOffset)
  );
}

export function resolveChartPreferences(
  params: Pick<URLSearchParams, "get">,
  saved: ChartPreferences,
): ChartPreferences {
  const chart = params.get("chart");
  const period = params.get("period");
  const interval = params.get("interval");
  const minute = params.get("minute") ?? "";
  const granularity = isChartGranularity(interval)
    ? interval
    : saved.granularity;
  return {
    detailed:
      chart === "detailed" ? true : chart === "simple" ? false : saved.detailed,
    period: CHART_PERIODS.find((option) => option === period) ?? saved.period,
    granularity,
    minute: isMinuteChart(granularity)
      ? granularity
      : isMinuteChart(minute)
        ? minute
        : saved.minute,
  };
}

export function saveChartViewport(
  range: LogicalRange,
  barCount: number,
): SavedChartViewport {
  return {
    visibleBars: range.to - range.from,
    rightOffset: range.to - (barCount - 1),
  };
}

export function restoreChartViewport(
  saved: SavedChartViewport,
  barCount: number,
): { from: number; to: number } | null {
  if (barCount <= 0 || !isSavedChartViewport(saved)) return null;
  const width = Math.min(saved.visibleBars, barCount + 1);
  const to = Math.max(
    width - 1,
    Math.min(barCount - 1 + saved.rightOffset, barCount + width - 2),
  );
  return { from: to - width, to };
}
