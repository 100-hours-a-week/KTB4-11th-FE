"use client";

import { useEffect, useRef } from "react";
import {
  AreaSeries,
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

export interface DuelReturnChartPoint {
  date: string;
  value: number;
}

interface DuelReturnChartProps {
  data: DuelReturnChartPoint[];
  colorVar: string;
  colorClass: string;
}

export function DuelReturnChart({
  data,
  colorVar,
  colorClass,
}: DuelReturnChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipDateRef = useRef<HTMLSpanElement>(null);
  const tooltipValueRef = useRef<HTMLSpanElement>(null);
  const crosshairLineRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const {
    tooltipRef,
    show: showTooltip,
    hide: hideTooltip,
  } = useChartTooltip<Time>();

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const lineColor = resolveCssColor(colorVar);
    const tertiaryColor = resolveCssColor("var(--color-text-neutral-tertiary)");
    const mutedColor = resolveCssColor("var(--color-border-neutral-muted)");

    const chart = createChart(container, {
      ...createBaseChartOptions(tertiaryColor),
      crosshair: {
        vertLine: { visible: false, labelVisible: false },
        horzLine: { visible: false, labelVisible: false },
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor: `${lineColor}40`,
      bottomColor: `${lineColor}00`,
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerRadius: 3,
      crosshairMarkerBorderColor: lineColor,
      crosshairMarkerBackgroundColor: lineColor,
    });

    series.setData(
      data.map((point) => ({
        time: toUnixTime(point.date),
        value: point.value,
      })),
    );

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const line = crosshairLineRef.current;
    if (line) line.style.backgroundColor = mutedColor;

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      const dateEl = tooltipDateRef.current;
      const valueEl = tooltipValueRef.current;
      if (!dateEl || !valueEl || !line) return;

      if (!param.time || !param.point) {
        hideTooltip();
        line.style.opacity = "0";
        return;
      }
      const time = param.time;

      const dataPoint = data.find((point) => toUnixTime(point.date) === time);
      const x = chart.timeScale().timeToCoordinate(time);
      const y = dataPoint ? series.priceToCoordinate(dataPoint.value) : null;
      if (!dataPoint || x === null || y === null) {
        hideTooltip();
        line.style.opacity = "0";
        return;
      }

      // 실제 커서가 해당 포인트와 멀리 떨어져 있으면 숨김
      const HOVER_THRESHOLD_PX = 24;
      const distance = Math.hypot(param.point.x - x, param.point.y - y);
      if (distance > HOVER_THRESHOLD_PX) {
        hideTooltip();
        line.style.opacity = "0";
        return;
      }

      showTooltip(time, x, container.clientWidth, () => {
        dateEl.textContent = formatTooltipDate(time);
        valueEl.textContent = formatSignedPercent(dataPoint.value);
      });

      line.style.opacity = "1";
      line.style.left = `${x}px`;
      line.style.height = `${y}px`;
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
      chartRef.current = null;
    };
  }, [data, colorVar, showTooltip, hideTooltip]);

  return (
    <div className="flex flex-col">
      <div className="relative">
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute bottom-0 left-0 flex flex-col items-center gap-0.5 opacity-0"
        >
          <span
            ref={tooltipDateRef}
            className="caption-1-regular text-text-neutral-tertiary"
          />
          <span
            ref={tooltipValueRef}
            className={cn("body-1-bold", colorClass)}
          />
        </div>
      </div>
      <div className="relative">
        <div ref={chartContainerRef} className="h-48 w-full" />
        <div
          ref={crosshairLineRef}
          className="pointer-events-none absolute top-0 left-0 w-px opacity-0"
          style={{ transform: "translateX(-50%)" }}
        />
      </div>
    </div>
  );
}
