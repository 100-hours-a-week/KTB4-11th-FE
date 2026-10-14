"use client";

import { useEffect, useRef } from "react";
import {
  AreaSeries,
  LineSeries,
  createChart,
  type IChartApi,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";
import { useChartTooltip } from "@/features/ai/hooks/useChartTooltip";
import {
  createBaseChartOptions,
  formatTooltipDate,
  resolveCssColor,
  toUnixTime,
} from "@/features/ai/utils/chartFormat";
import { cn } from "@/shared/utils/cn";
import { formatSignedPercent } from "@/shared/utils/getReturnRateInfo";

export interface DuelCompareChartPoint {
  date: string;
  myValue: number;
  aiValue: number;
}

interface DuelCompareReturnChartProps {
  data: DuelCompareChartPoint[];
  isWin: boolean;
}

export function DuelCompareReturnChart({
  data,
  isWin,
}: DuelCompareReturnChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipDateRef = useRef<HTMLSpanElement>(null);
  const myValueRef = useRef<HTMLSpanElement>(null);
  const aiValueRef = useRef<HTMLSpanElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const {
    tooltipRef,
    show: showTooltip,
    hide: hideTooltip,
  } = useChartTooltip<Time>();

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const accentColor = resolveCssColor("var(--color-text-accent)");
    const neutralColor = resolveCssColor("var(--color-text-neutral-tertiary)");
    const tertiaryColor = neutralColor;

    const chart = createChart(container, {
      ...createBaseChartOptions(tertiaryColor),
      crosshair: {
        vertLine: { color: tertiaryColor, width: 1, labelVisible: false },
        horzLine: { visible: false, labelVisible: false },
      },
    });

    function addCompareSeries(isWinner: boolean) {
      if (isWinner) {
        return chart.addSeries(AreaSeries, {
          lineColor: accentColor,
          topColor: `${accentColor}40`,
          bottomColor: `${accentColor}00`,
          lineWidth: 2,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerRadius: 3,
        });
      }
      return chart.addSeries(LineSeries, {
        color: neutralColor,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
        crosshairMarkerRadius: 3,
      });
    }

    const mySeries = addCompareSeries(isWin);
    const aiSeries = addCompareSeries(!isWin);

    mySeries.setData(
      data.map((point) => ({
        time: toUnixTime(point.date),
        value: point.myValue,
      })),
    );
    aiSeries.setData(
      data.map((point) => ({
        time: toUnixTime(point.date),
        value: point.aiValue,
      })),
    );

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      const dateEl = tooltipDateRef.current;
      const myValueEl = myValueRef.current;
      const aiValueEl = aiValueRef.current;
      if (!dateEl || !myValueEl || !aiValueEl) return;

      if (!param.time) {
        hideTooltip();
        return;
      }
      const time = param.time;

      const point = data.find((p) => toUnixTime(p.date) === time);
      const x = chart.timeScale().timeToCoordinate(time);
      if (!point || x === null) {
        hideTooltip();
        return;
      }

      showTooltip(time, x, container.clientWidth, () => {
        dateEl.textContent = formatTooltipDate(time);
        myValueEl.textContent = `나 ${formatSignedPercent(point.myValue)}`;
        aiValueEl.textContent = `AI ${formatSignedPercent(point.aiValue)}`;
      });
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
      chartRef.current = null;
    };
  }, [data, isWin, showTooltip, hideTooltip]);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute bottom-0 left-0 flex flex-col items-center gap-0.5 opacity-0"
        >
          <span
            className="caption-1-regular text-text-neutral-tertiary"
            ref={tooltipDateRef}
          />
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "caption-1-semibold",
                isWin ? "text-text-accent" : "text-text-neutral-tertiary",
              )}
              ref={myValueRef}
            />
            <span
              className={cn(
                "caption-1-semibold",
                isWin ? "text-text-neutral-tertiary" : "text-text-accent",
              )}
              ref={aiValueRef}
            />
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="h-40 w-full" />
    </div>
  );
}
