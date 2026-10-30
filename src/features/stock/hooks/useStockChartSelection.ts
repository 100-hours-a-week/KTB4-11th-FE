"use client";

// 길게 누른 봉의 선택 정보·십자선과 조회 모드 관리

import { useMemo, useRef, useState, type RefObject } from "react";
import type { IChartApi } from "lightweight-charts";
import { useChartLongPress } from "@/features/stock/hooks/useChartLongPress";
import type { Bar, ChartCrosshair } from "@/features/stock/types/chart";
import {
  getChartSelection,
  type ChartSelection,
} from "@/features/stock/utils/chart/chartSelection";
import {
  isMinuteChart,
  type ChartGranularity,
} from "@/features/stock/utils/chart/chartPeriod";
import { formatStockChartDate } from "@/features/stock/utils/chart/stockChart";
import { stockChartOptions } from "@/features/stock/utils/chart/chartOptions";
import type { createDetailedSeries } from "@/features/stock/utils/chart/chartSeries";
import { toUnixTime } from "@/shared/utils/chartFormat";

type SelectionContext = {
  chart: IChartApi;
  series: ReturnType<typeof createDetailedSeries>["series"];
  getBars: () => Bar[];
};

export function useStockChartSelection(
  containerRef: RefObject<HTMLDivElement | null>,
  granularity: ChartGranularity,
  onSelectionChange: (selection: ChartSelection | null) => void,
) {
  const [crosshair, setCrosshair] = useState<ChartCrosshair | null>(null);
  const [selection, setSelection] = useState<ChartSelection | null>(null);
  const contextRef = useRef<SelectionContext | null>(null);
  const selectedPointRef = useRef<{ timestamp: string; y: number } | null>(
    null,
  );
  const controller = useMemo(() => {
    const clear = () => {
      selectedPointRef.current = null;
      const context = contextRef.current;
      if (context) {
        const defaults = stockChartOptions("");
        context.chart.applyOptions({
          handleScroll: defaults.handleScroll,
          handleScale: defaults.handleScale,
        });
        context.chart.clearCrosshairPosition();
      }
      setCrosshair(null);
      setSelection(null);
      onSelectionChange(null);
    };
    const selectAt = (x: number, y: number) => {
      const context = contextRef.current;
      if (!context) return;
      const { chart, series, getBars } = context;
      const bars = getBars();
      if (!bars.length) {
        clear();
        return;
      }
      const width = chart.timeScale().width();
      const logical = chart
        .timeScale()
        .coordinateToLogical(Math.max(0, Math.min(width - 1, x)));
      if (logical === null) return;
      const index = Math.max(0, Math.min(bars.length - 1, Math.round(logical)));
      const selected = getChartSelection(bars, index);
      selectedPointRef.current = { timestamp: selected.bar.timestamp, y };
      const localY = Math.max(0, Math.min(chart.panes()[0].getHeight() - 1, y));
      setCrosshair({
        x:
          chart
            .timeScale()
            .timeToCoordinate(toUnixTime(selected.bar.timestamp)) ?? x,
        y: localY,
        price: series.coordinateToPrice(localY) ?? selected.bar.close,
        date: formatStockChartDate(
          selected.bar.timestamp,
          isMinuteChart(granularity),
        ),
        width,
        height: chart.panes().reduce((sum, pane) => sum + pane.getHeight(), 0),
      });
      setSelection(selected);
      onSelectionChange(selected);
    };
    return {
      attach(next: SelectionContext) {
        contextRef.current = next;
      },
      detach() {
        clear();
        contextRef.current = null;
      },
      refresh() {
        const context = contextRef.current;
        const selectedPoint = selectedPointRef.current;
        if (!context || !selectedPoint) return;
        const x = context.chart
          .timeScale()
          .timeToCoordinate(toUnixTime(selectedPoint.timestamp));
        if (x === null) clear();
        else selectAt(x, selectedPoint.y);
      },
      handlers: {
        onStart(x: number, y: number) {
          const context = contextRef.current;
          if (!context) return;
          context.chart.applyOptions({
            handleScroll: false,
            handleScale: false,
          });
          selectAt(x, y);
        },
        onMove: selectAt,
        onEnd: clear,
      },
    };
  }, [granularity, onSelectionChange]);
  useChartLongPress(containerRef, controller.handlers);
  return { crosshair, selection, controller };
}
