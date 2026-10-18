"use client";

// 기본 선 차트와 최고·최저, 선택 가격 표시

import { cn } from "@/shared/utils/cn";
import {
  useStockSimpleChart,
  type StockSimpleChartOptions,
} from "@/features/stock/hooks/useStockSimpleChart";
import { StockChartExtrema } from "@/features/stock/components/chart/StockChartExtrema";

export function StockSimpleChart({
  expanded = false,
  ...options
}: StockSimpleChartOptions & { expanded?: boolean }) {
  const { containerRef, baselineY, extremes, dots, tooltip } =
    useStockSimpleChart(options);
  const { baseline } = options;
  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={cn(
          "w-full",
          expanded ? "h-[calc(100dvh-150px)]" : "h-[clamp(280px,43dvh,440px)]",
        )}
      />
      {!tooltip && (
        <>
          {dots.map((dot, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="pointer-events-none absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45"
              style={{ left: dot.x, top: dot.y, backgroundColor: dot.color }}
            />
          ))}
          <StockChartExtrema
            points={extremes}
            textClassName="caption-1-regular"
          />
        </>
      )}
      {tooltip && (
        <>
          {baselineY !== null && (
            <span
              className="caption-1-regular text-text-neutral-tertiary bg-bg-layer-default pointer-events-none absolute right-3 -translate-y-1/2 px-1"
              style={{ top: baselineY }}
            >
              {baseline.toLocaleString()}원
            </span>
          )}
          <div
            className="bg-border-neutral-tertiary pointer-events-none absolute top-12 bottom-0 w-px"
            style={{ left: tooltip.x }}
          />
          <div
            ref={(element) => {
              if (!element) return;
              element.style.left = `${Math.max(0, Math.min(tooltip.width - element.offsetWidth, tooltip.x - element.offsetWidth / 2))}px`;
            }}
            className="pointer-events-none absolute top-0 flex w-max max-w-full flex-col items-center"
            style={{
              left: tooltip.x,
            }}
          >
            <span className="caption-1-regular text-text-neutral-secondary">
              {tooltip.date}
            </span>
            <span className="body-1-bold text-text-neutral-secondary">
              {tooltip.value.toLocaleString()}원
            </span>
          </div>
        </>
      )}
    </div>
  );
}
