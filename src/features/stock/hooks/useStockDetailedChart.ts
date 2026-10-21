"use client";

// 상세 차트 생성·정리와 데이터·현재가·확대 범위 갱신

import { useEffect, useRef, useState } from "react";
import { createChart, LineStyle, type LogicalRange } from "lightweight-charts";
import { useStockChartSelection } from "@/features/stock/hooks/useStockChartSelection";
import { createDetailedViewport } from "@/features/stock/utils/chart/chartViewport";
import type { ChartSelection } from "@/features/stock/utils/chart/chartSelection";
import type { Bar, ChartExtreme } from "@/features/stock/types/chart";
import type { ChartGranularity } from "@/features/stock/utils/chart/chartPeriod";
import {
  chartDayStarts,
  detailedChartOptions,
} from "@/features/stock/utils/chart/chartOptions";
import { resolveCssColor } from "@/shared/utils/chartFormat";
import { createDetailedSeries } from "@/features/stock/utils/chart/chartSeries";

export interface StockDetailedChartOptions {
  bars: Bar[];
  onSelectionChange: (selection: ChartSelection | null) => void;
  currentPrice: number;
  previousClose: number;
  granularity: ChartGranularity;
  movingAverage: boolean;
  volume: boolean;
  candle: boolean;
}

export function useStockDetailedChart({
  bars,
  onSelectionChange,
  granularity,
  currentPrice,
  previousClose,
  movingAverage,
  volume,
  candle,
}: StockDetailedChartOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<LogicalRange | null>(null);
  const [volumeTop, setVolumeTop] = useState(0);
  const [extremes, setExtremes] = useState<ChartExtreme[]>([]);
  const { crosshair, selection, controller } = useStockChartSelection(
    containerRef,
    granularity,
    onSelectionChange,
  );
  const inputRef = useRef({ bars, currentPrice, previousClose });
  const runtimeRef = useRef<{
    updateBars: () => void;
    updatePrice: () => void;
  } | null>(null);
  useEffect(() => {
    inputRef.current = { bars, currentPrice, previousClose };
  }, [bars, currentPrice, previousClose]);
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !inputRef.current.bars.length) return;
    const { bars, currentPrice, previousClose } = inputRef.current;
    const dayStarts = chartDayStarts(bars);
    const muted = resolveCssColor("var(--color-text-neutral-tertiary)");
    const rise = resolveCssColor("var(--color-text-price-rise)");
    const fall = resolveCssColor("var(--color-text-price-fall)");
    const chart = createChart(
      container,
      detailedChartOptions(
        muted,
        granularity,
        container.clientWidth,
        container.clientHeight,
        dayStarts,
      ),
    );
    const chartSeries = createDetailedSeries(chart, {
      candle,
      movingAverage,
      volume,
      rise,
      fall,
    });
    const { series } = chartSeries;
    chartSeries.updateBars(bars);
    const livePrice =
      currentPrice > 0 ? currentPrice : bars[bars.length - 1].close;
    const currentPriceLine = series.createPriceLine({
      price: livePrice,
      color: livePrice >= previousClose ? rise : fall,
      lineWidth: 1,
      lineStyle: LineStyle.Dotted,
      axisLabelVisible: true,
    });
    const viewport = createDetailedViewport({
      chart,
      series,
      granularity,
      rise,
      fall,
    });
    controller.attach({ chart, series, getBars: () => inputRef.current.bars });
    const initialCount =
      granularity === "년"
        ? Math.min(20, bars.length)
        : granularity === "월"
          ? 18
          : 20;
    const initialRange = rangeRef.current ?? {
      from: Math.max(-1, bars.length - initialCount) - 0.5,
      to: bars.length + 1,
    };
    let rangeInitialized = false;
    const updateViewport = () => {
      const { bars, currentPrice } = inputRef.current;
      const price = currentPrice > 0 ? currentPrice : (bars.at(-1)?.close ?? 0);
      const view = viewport.read(bars, price);
      setVolumeTop(view.volumeTop);
      setExtremes(view.extremes);
    };
    runtimeRef.current = {
      updatePrice: () => {
        const { bars, currentPrice, previousClose } = inputRef.current;
        const price =
          currentPrice > 0 ? currentPrice : (bars.at(-1)?.close ?? 0);
        currentPriceLine.applyOptions({
          price,
          color: price >= previousClose ? rise : fall,
        });
        updateViewport();
      },
      updateBars: () => {
        const range = chart.timeScale().getVisibleLogicalRange();
        dayStarts.clear();
        for (const time of chartDayStarts(inputRef.current.bars))
          dayStarts.add(time);
        chartSeries.updateBars(inputRef.current.bars);
        if (rangeInitialized && range)
          chart.timeScale().setVisibleLogicalRange(range);
        updateViewport();
        controller.refresh();
      },
    };
    chart.timeScale().subscribeVisibleLogicalRangeChange(updateViewport);
    const observer = new ResizeObserver(() => {
      chart.resize(container.clientWidth, container.clientHeight);
      if (!rangeInitialized) {
        chart.timeScale().setVisibleLogicalRange(initialRange);
        rangeInitialized = true;
      }
      updateViewport();
      controller.refresh();
    });
    observer.observe(container);
    updateViewport();
    return () => {
      if (rangeInitialized)
        rangeRef.current = chart.timeScale().getVisibleLogicalRange();
      observer.disconnect();
      runtimeRef.current = null;
      controller.detach();
      chart.timeScale().unsubscribeVisibleLogicalRangeChange(updateViewport);
      chart.remove();
    };
  }, [controller, granularity, movingAverage, volume, candle]);
  useEffect(() => {
    runtimeRef.current?.updateBars();
  }, [bars]);
  useEffect(() => {
    runtimeRef.current?.updatePrice();
  }, [currentPrice, previousClose]);
  return { containerRef, volumeTop, extremes, crosshair, selection };
}
