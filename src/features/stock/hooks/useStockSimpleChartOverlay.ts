"use client";

import { useState, type RefObject } from "react";
import type {
  IChartApi,
  ISeriesApi,
  MouseEventParams,
  Time,
} from "lightweight-charts";
import type { Bar, ChartExtreme } from "@/features/stock/types/chart";
import { getBarExtremes } from "@/features/stock/utils/chart/chartExtrema";
import { formatStockChartDate } from "@/features/stock/utils/chart/stockChart";
import { resolveCssColor, toUnixTime } from "@/shared/utils/chartFormat";

interface ChartDot {
  x: number;
  y: number;
  color: string;
}

// 기본 차트 위에 표시하는 라벨·끝점·툴팁 상태와 좌표를 관리
export function useStockSimpleChartOverlay({
  containerRef,
  chartRef,
  seriesRef,
  bars,
  baseline,
  rise,
  intraday,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  chartRef: RefObject<IChartApi | null>;
  seriesRef: RefObject<ISeriesApi<"Line"> | null>;
  bars: Bar[];
  baseline: number;
  rise: boolean;
  intraday: boolean;
}) {
  const [baselineY, setBaselineY] = useState<number | null>(null);
  const [extremes, setExtremes] = useState<ChartExtreme[]>([]);
  const [dots, setDots] = useState<ChartDot[]>([]);
  const [endpoint, setEndpoint] = useState<ChartDot | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    width: number;
    date: string;
    value: number;
  } | null>(null);

  const updateOverlays = () => {
    const container = containerRef.current;
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!container || !chart || !series) return;
    const color = resolveCssColor(
      rise ? "var(--color-text-price-rise)" : "var(--color-text-price-fall)",
    );
    setBaselineY(baseline > 0 ? series.priceToCoordinate(baseline) : null);
    const values = getBarExtremes(bars, "close");
    if (!values) {
      setDots([]);
      setExtremes([]);
      setEndpoint(null);
      return;
    }
    const { high, low } = values;
    const position = (bar: Bar) => ({
      x: chart.timeScale().timeToCoordinate(toUnixTime(bar.timestamp)),
      y: series.priceToCoordinate(bar.close),
    });
    setDots(
      [high, low].flatMap((bar, index) => {
        const { x, y } = position(bar);
        return x === null || y === null
          ? []
          : [{ x, y: y + (index === 0 ? -10 : 10), color }];
      }),
    );
    setExtremes(
      [high, low].flatMap((bar, index) => {
        const { x, y } = position(bar);
        if (x === null || y === null) return [];
        const text = `${index === 0 ? "최고" : "최저"} ${bar.close.toLocaleString()}원`;
        const width = text.length * 6;
        return [
          {
            key: String(index),
            text,
            high: index === 0,
            color,
            x: Math.max(
              0,
              Math.min(container.clientWidth - width, x - width / 2),
            ),
            y: y + (index === 0 ? -16 : 12),
          },
        ];
      }),
    );
    const { x, y } = position(bars.at(-1)!);
    setEndpoint(x === null || y === null ? null : { x, y, color });
  };

  const onCrosshair = (event: MouseEventParams<Time>) => {
    const chart = chartRef.current;
    const container = containerRef.current;
    const bar = event.time
      ? bars.find(
          (item) => Number(toUnixTime(item.timestamp)) === Number(event.time),
        )
      : undefined;
    if (
      !chart ||
      !container ||
      !bar ||
      !event.point ||
      event.point.x < 0 ||
      event.point.x > container.clientWidth
    ) {
      setTooltip(null);
      return;
    }
    setTooltip({
      x: chart.timeScale().timeToCoordinate(event.time!) ?? event.point.x,
      width: container.clientWidth,
      date: formatStockChartDate(bar.timestamp, intraday),
      value: bar.close,
    });
  };
  return {
    baselineY,
    extremes,
    dots,
    endpoint,
    tooltip,
    updateOverlays,
    onCrosshair,
    clearTooltip: () => setTooltip(null),
  };
}
