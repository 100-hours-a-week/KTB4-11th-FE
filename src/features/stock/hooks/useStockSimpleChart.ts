"use client";

// 차트 인스턴스를 유지하고 시세에 따라 선·라벨·끝점을 갱신
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  LineSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";
import type { Bar } from "@/features/stock/types/chart";
import type { ChartPeriod } from "@/features/stock/types/stockDetail";
import { resolveCssColor } from "@/shared/utils/chartFormat";
import { stockChartOptions } from "@/features/stock/utils/chart/chartOptions";
import { useStockSimpleChartOverlay } from "@/features/stock/hooks/useStockSimpleChartOverlay";
import {
  buildSimpleChartData,
  type SimpleChartTick,
} from "@/features/stock/utils/chart/simpleChartData";

export interface StockSimpleChartOptions {
  bars: Bar[];
  baseline: number;
  intraday: boolean;
  rise: boolean;
  period: ChartPeriod;
  tick?: SimpleChartTick;
}

export function useStockSimpleChart({
  bars,
  baseline,
  intraday,
  rise,
  period,
  tick,
}: StockSimpleChartOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const baselineRef = useRef<IPriceLine | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const snapshot = useMemo(
    () => buildSimpleChartData(bars, period, tick, now),
    [bars, period, tick, now],
  );

  // 시세가 오지 않더라도 장 마감·오래된 시세에서는 퍼지는 효과를 멈춘다.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const overlay = useStockSimpleChartOverlay({
    containerRef,
    chartRef,
    seriesRef,
    bars: snapshot.bars,
    baseline,
    rise,
    intraday,
  });
  const updateOverlays = useEffectEvent(() => overlay.updateOverlays());
  const onCrosshair = useEffectEvent((event: MouseEventParams<Time>) =>
    overlay.onCrosshair(event),
  );
  const clearTooltip = useEffectEvent(() => overlay.clearTooltip());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
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
    chartRef.current = chart;
    seriesRef.current = chart.addSeries(LineSeries, {
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });
    const clear = () => clearTooltip();
    const handleCrosshair = (event: MouseEventParams<Time>) =>
      onCrosshair(event);
    const handleRange = () => updateOverlays();
    chart.subscribeCrosshairMove(handleCrosshair);
    chart.timeScale().subscribeVisibleLogicalRangeChange(handleRange);
    container.addEventListener("pointerleave", clear);
    container.addEventListener("touchend", clear);
    const observer = new ResizeObserver(() => {
      chart.resize(container.clientWidth, container.clientHeight);
      updateOverlays();
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      chart.unsubscribeCrosshairMove(handleCrosshair);
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRange);
      container.removeEventListener("pointerleave", clear);
      container.removeEventListener("touchend", clear);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      baselineRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!chart || !series) return;
    const color = resolveCssColor(
      rise ? "var(--color-text-price-rise)" : "var(--color-text-price-fall)",
    );
    series.applyOptions({ color });
    // 우측 고정은 마지막 가격을 오른쪽 끝으로 밀어 미래 시간의 여백을 없앤다.
    chart.timeScale().applyOptions({
      fixLeftEdge: period !== "1일",
      fixRightEdge: period !== "1일",
      minBarSpacing: period === "1일" ? 0.01 : 0.5,
    });
    series.setData(snapshot.data);
    if (baselineRef.current) series.removePriceLine(baselineRef.current);
    baselineRef.current =
      baseline > 0
        ? series.createPriceLine({
            price: baseline,
            color: resolveCssColor("var(--color-text-neutral-tertiary)"),
            lineWidth: 1,
            lineStyle: LineStyle.Dashed,
            axisLabelVisible: false,
          })
        : null;
    if (snapshot.data.length)
      chart.timeScale().setVisibleLogicalRange({
        from: period === "1일" ? 0 : -1,
        to: period === "1일" ? snapshot.data.length - 1 : snapshot.data.length,
      });
    updateOverlays();
  }, [snapshot, baseline, rise, period]);
  return {
    containerRef,
    baselineY: overlay.baselineY,
    extremes: overlay.extremes,
    dots: overlay.dots,
    tooltip: overlay.tooltip,
    endpoint: overlay.endpoint,
    isLive: snapshot.isLive,
  };
}
