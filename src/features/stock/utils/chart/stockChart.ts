// 한국 시간 기준 기간 필터·날짜 포맷과 이동평균선 설정

import type { Bar } from "@/features/stock/types/chart";
import type { ChartPeriod } from "@/features/stock/types/stockDetail";

export function seoulDate(timestamp: string) {
  return new Date(new Date(timestamp).getTime() + 9 * 60 * 60 * 1000);
}

export function periodStart(timestamp: string, period: ChartPeriod): number {
  const date = seoulDate(timestamp);
  date.setUTCHours(0, 0, 0, 0);
  if (period === "1주") date.setUTCDate(date.getUTCDate() - 7);
  if (period === "3달") date.setUTCMonth(date.getUTCMonth() - 3);
  if (period === "1년" || period === "전체")
    date.setUTCFullYear(date.getUTCFullYear() - 1);
  return date.getTime() - 9 * 60 * 60 * 1000;
}

export function selectPeriodBars(bars: Bar[], period: ChartPeriod) {
  if (!bars.length) return { bars, baseline: 0 };
  const start = periodStart(bars[bars.length - 1].timestamp, period);
  const index = bars.findIndex((bar) => Date.parse(bar.timestamp) >= start);
  const selected = bars.slice(Math.max(0, index));
  return { bars: selected, baseline: bars[Math.max(0, index - 1)].close };
}

export function formatStockChartDate(
  timestamp: string,
  intraday = false,
  unit?: string,
) {
  const date = seoulDate(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  if (unit === "년") return String(year);
  if (unit === "월") return `${year}.${month}`;
  const time = intraday
    ? ` ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`
    : "";
  return `${year}.${month}.${day}${time}`;
}

export const MOVING_AVERAGES = [
  { period: 5, color: "#13b580" },
  { period: 20, color: "#fa4b60" },
  { period: 60, color: "#ff8b00" },
  { period: 120, color: "#a83ddb" },
] as const;
