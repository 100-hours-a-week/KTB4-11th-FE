// 최고·최저 봉 계산과 라벨 문구·좌표 구성

import type { Bar, ChartExtreme } from "@/features/stock/types/chart";
import {
  isMinuteChart,
  type ChartGranularity,
} from "@/features/stock/utils/chart/chartPeriod";
import { formatStockChartDate } from "@/features/stock/utils/chart/stockChart";

export function getBarExtremes(bars: Bar[], mode: "close" | "ohlc") {
  if (!bars.length) return null;
  const highKey = mode === "close" ? "close" : "high";
  const lowKey = mode === "close" ? "close" : "low";
  let high = bars[0];
  let low = bars[0];
  for (const bar of bars) {
    if (bar[highKey] > high[highKey]) high = bar;
    if (bar[lowKey] < low[lowKey]) low = bar;
  }
  return { high, low };
}

export function formatExtremeLabel(
  value: number,
  currentPrice: number,
  timestamp: string,
  granularity: ChartGranularity,
) {
  const percent = (currentPrice / value - 1) * 100;
  const date = isMinuteChart(granularity)
    ? formatStockChartDate(timestamp, true).slice(5)
    : granularity === "일" || granularity === "주"
      ? formatStockChartDate(timestamp).slice(2)
      : formatStockChartDate(timestamp, false, granularity);
  return `${value.toLocaleString()}원 (${percent > 0 ? "+" : ""}${percent.toFixed(1)}%, ${date})`;
}

export function projectDetailedExtremes({
  high,
  low,
  currentPrice,
  granularity,
  width,
  height,
  timeToX,
  priceToY,
  rise,
  fall,
}: {
  high: Bar;
  low: Bar;
  currentPrice: number;
  granularity: ChartGranularity;
  width: number;
  height: number;
  rise: string;
  fall: string;
  timeToX: (timestamp: string) => number;
  priceToY: (value: number) => number;
}): ChartExtreme[] {
  return [high, low].map((bar, index) => {
    const value = index === 0 ? bar.high : bar.low;
    const text = formatExtremeLabel(
      value,
      currentPrice,
      bar.timestamp,
      granularity,
    );
    const labelWidth = Math.min(width, text.length * 6);
    const x = timeToX(bar.timestamp);
    const y = priceToY(value);
    return {
      key: String(index),
      anchorX: x,
      anchorY: y,
      arrow:
        x >= 6 && x <= width - 6 && (index === 0 ? y >= 36 : y <= height - 36),
      boundsWidth: width,
      x: Math.max(0, Math.min(width - labelWidth, x - labelWidth / 2)),
      y: index === 0 ? Math.max(20, y - 14) : y + 12,
      text,
      high: index === 0,
      color: index === 0 ? rise : fall,
    };
  });
}
