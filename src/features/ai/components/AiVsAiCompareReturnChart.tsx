"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  type IChartApi,
  type MouseEventParams,
  type Time,
} from "lightweight-charts";
import type { InvestmentTendency } from "@/features/ai/types/aiStrategy";
import { useChartTooltip } from "@/shared/hooks/useChartTooltip";
import {
  addHighlightableSeries,
  createBaseChartOptions,
  createCompareCrosshairOptions,
  formatTooltipDate,
  resolveCssColor,
  toUnixTime,
} from "@/shared/utils/chartFormat";
import { formatSignedPercent } from "@/shared/utils/getReturnRateInfo";

export const TENDENCY_CHART_COLOR_VARS: Record<InvestmentTendency, string> = {
  성장형: "var(--color-red-500)",
  성장추구형: "var(--color-orange-500)",
  위험중립형: "var(--color-yellow-600)",
  안정추구형: "var(--color-green-500)",
  안정형: "var(--color-blue-500)",
};

export interface AiVsAiCompareChartPoint {
  date: string;
  values: Record<string, number>;
}

interface AiVsAiCompareReturnChartAgent {
  agentLabel: string;
  investmentTendency: InvestmentTendency;
}

interface AiVsAiCompareReturnChartProps {
  data: AiVsAiCompareChartPoint[];
  agents: AiVsAiCompareReturnChartAgent[];
}

export function AiVsAiCompareReturnChart({
  data,
  agents,
}: AiVsAiCompareReturnChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipDateRef = useRef<HTMLSpanElement>(null);
  const tooltipValuesRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const {
    tooltipRef,
    show: showTooltip,
    hide: hideTooltip,
  } = useChartTooltip<Time>();

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const tertiaryColor = resolveCssColor("var(--color-text-neutral-tertiary)");

    const chart = createChart(container, {
      ...createBaseChartOptions(tertiaryColor),
      crosshair: createCompareCrosshairOptions(tertiaryColor),
    });

    const lastPoint = data[data.length - 1];
    const leaderLabel = lastPoint
      ? agents.reduce((leader, agent) =>
          (lastPoint.values[agent.agentLabel] ?? -Infinity) >
          (lastPoint.values[leader.agentLabel] ?? -Infinity)
            ? agent
            : leader,
        ).agentLabel
      : agents[0]?.agentLabel;

    agents.forEach((agent) => {
      const color = resolveCssColor(
        TENDENCY_CHART_COLOR_VARS[agent.investmentTendency],
      );
      const series = addHighlightableSeries(
        chart,
        color,
        agent.agentLabel === leaderLabel,
      );
      series.setData(
        data.map((point) => ({
          time: toUnixTime(point.date),
          value: point.values[agent.agentLabel] ?? 0,
        })),
      );
    });

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleCrosshairMove = (param: MouseEventParams<Time>) => {
      const dateEl = tooltipDateRef.current;
      const valuesEl = tooltipValuesRef.current;
      if (!dateEl || !valuesEl) return;

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
        valuesEl.innerHTML = "";
        agents.forEach((agent) => {
          const value = point.values[agent.agentLabel] ?? 0;
          const color = resolveCssColor(
            TENDENCY_CHART_COLOR_VARS[agent.investmentTendency],
          );
          const item = document.createElement("span");
          item.className = "caption-1-semibold";
          item.style.color = color;
          item.textContent = `${agent.agentLabel} ${formatSignedPercent(value)}`;
          valuesEl.appendChild(item);
        });
      });
    };

    chart.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chart.unsubscribeCrosshairMove(handleCrosshairMove);
      chart.remove();
      chartRef.current = null;
    };
  }, [data, agents, showTooltip, hideTooltip]);

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
          <div
            ref={tooltipValuesRef}
            className="flex flex-nowrap items-center gap-2 whitespace-nowrap"
          />
        </div>
      </div>
      <div ref={chartContainerRef} className="h-48 w-full" />
    </div>
  );
}
