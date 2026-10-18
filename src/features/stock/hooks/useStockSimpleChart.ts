"use client";

// 기본 차트 생성·정리, 툴팁과 최고·최저 좌표 관리

import { useEffect, useRef, useState } from "react";
import {
  LineSeries,
  LineStyle,
  createChart,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";
import type { Bar } from "@/features/stock/types/chart";
import { formatStockChartDate } from "@/features/stock/utils/chart/stockChart";
import { resolveCssColor, toUnixTime } from "@/shared/utils/chartFormat";
import { stockChartOptions } from "@/features/stock/utils/chart/chartOptions";
import type { ChartExtreme } from "@/features/stock/types/chart";
import { getBarExtremes } from "@/features/stock/utils/chart/chartExtrema";

export interface StockSimpleChartOptions {
  bars: Bar[];
  baseline: number;
  intraday: boolean;
  rise: boolean;
}

export function useStockSimpleChart({
  bars,
  baseline,
  intraday,
  rise,
}: StockSimpleChartOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [baselineY, setBaselineY] = useState<number | null>(null);
  const [extremes, setExtremes] = useState<ChartExtreme[]>([]);
  const [dots, setDots] = useState<{ x: number; y: number; color: string }[]>(
    [],
  );
  const [tooltip, setTooltip] = useState<{
    x: number;
    width: number;
    date: string;
    value: number;
  } | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !bars.length) return;
    const color = resolveCssColor(
      rise ? "var(--color-text-price-rise)" : "var(--color-text-price-fall)",
    );
    const muted = resolveCssColor("var(--color-text-neutral-tertiary)");
    const chart = createChart(container, {
      ...stockChartOptions(muted),
      autoSize: false,
      width: container.clientWidth,
      height: container.clientHeight,
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: {
        visible: false,
        scaleMargins: { top: 0.18, bottom: 0.18 },
      },
      timeScale: {
        visible: false,
        rightOffset: 0,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      crosshair: {
        vertLine: { visible: false, labelVisible: false },
        horzLine: { visible: false, labelVisible: false },
      },
      handleScroll: false,
      handleScale: false,
    });
    const series = chart.addSeries(LineSeries, {
      color,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });
    const points = bars.map((bar) => ({
      time: toUnixTime(bar.timestamp),
      value: bar.close,
    }));
    series.setData(points);
    if (baseline > 0)
      series.createPriceLine({
        price: baseline,
        color: muted,
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: false,
      });
    chart.timeScale().setVisibleLogicalRange({ from: -1, to: points.length });
    const updateExtremes = () => {
      setBaselineY(baseline > 0 ? series.priceToCoordinate(baseline) : null);
      const { high, low } = getBarExtremes(bars, "close")!;
      setDots(
        [high, low].map((bar, index) => ({
          x: chart.timeScale().timeToCoordinate(toUnixTime(bar.timestamp)) ?? 0,
          y:
            (series.priceToCoordinate(bar.close) ?? 0) +
            (index === 0 ? -10 : 10),
          color,
        })),
      );
      setExtremes(
        [high, low].map((bar, index) => {
          const x =
            chart.timeScale().timeToCoordinate(toUnixTime(bar.timestamp)) ?? 0;
          const y = series.priceToCoordinate(bar.close) ?? 0;
          const text = `${index === 0 ? "최고" : "최저"} ${bar.close.toLocaleString()}원`;
          const width = text.length * 6;
          return {
            key: String(index),
            text,
            high: index === 0,
            color,
            x: Math.max(
              0,
              Math.min(container.clientWidth - width, x - width / 2),
            ),
            y: y + (index === 0 ? -16 : 12),
          };
        }),
      );
    };
    const byTime = new Map(
      points.map((point, index) => [Number(point.time), bars[index]]),
    );
    const onCrosshair = (event: MouseEventParams<Time>) => {
      const bar = event.time ? byTime.get(Number(event.time)) : undefined;
      if (
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
    const clear = () => setTooltip(null);
    container.addEventListener("pointerleave", clear);
    container.addEventListener("touchend", clear);
    chart.subscribeCrosshairMove(onCrosshair);
    chart.timeScale().subscribeVisibleLogicalRangeChange(updateExtremes);
    const observer = new ResizeObserver(() => {
      chart.resize(container.clientWidth, container.clientHeight);
      updateExtremes();
    });
    observer.observe(container);
    updateExtremes();
    return () => {
      observer.disconnect();
      container.removeEventListener("pointerleave", clear);
      container.removeEventListener("touchend", clear);
      chart.unsubscribeCrosshairMove(onCrosshair);
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(updateExtremes);
      chart.remove();
    };
  }, [bars, baseline, intraday, rise]);
  return { containerRef, baselineY, extremes, dots, tooltip };
}
