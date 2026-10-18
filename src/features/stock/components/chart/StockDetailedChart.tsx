"use client";

// 상세 차트와 이동평균선 안내, 거래량 표시

import { cn } from "@/shared/utils/cn";
import {
  useStockDetailedChart,
  type StockDetailedChartOptions,
} from "@/features/stock/hooks/useStockDetailedChart";
import { MOVING_AVERAGES } from "@/features/stock/utils/chart/stockChart";
import { StockChartExtrema } from "@/features/stock/components/chart/StockChartExtrema";
import { StockChartCrosshair } from "@/features/stock/components/chart/StockChartCrosshair";

export function StockDetailedChart({
  expanded = false,
  ...options
}: StockDetailedChartOptions & { expanded?: boolean }) {
  const { containerRef, volumeTop, extremes, crosshair, selection } =
    useStockDetailedChart(options);
  const { movingAverage, volume } = options;
  return (
    <div className="relative">
      <div className="caption-1-regular text-text-neutral-secondary pointer-events-none relative z-10 flex h-10 max-w-full flex-wrap content-start gap-x-1 pt-2 pr-20 pl-2">
        {movingAverage && (
          <>
            <span>이동평균선</span>
            {MOVING_AVERAGES.map((line) => (
              <span key={line.period} style={{ color: line.color }}>
                {line.period}
              </span>
            ))}
          </>
        )}
      </div>
      <div
        ref={containerRef}
        className={cn(
          "w-full",
          expanded ? "h-[calc(100dvh-150px)]" : "h-[clamp(320px,45dvh,520px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 top-10 bottom-0">
        <StockChartExtrema points={extremes} />
        <StockChartCrosshair point={crosshair} />
      </div>
      {volume && (
        <span
          className="caption-1-regular text-text-neutral-secondary pointer-events-none absolute left-2"
          style={{ top: volumeTop + 44 }}
        >
          거래량 (20)
          {selection && (
            <>
              <span className="text-text-accent ml-1">
                {selection.bar.volume.toLocaleString()}
              </span>
              {selection.volumeAverage !== null && (
                <span
                  className="ml-1"
                  style={{ color: MOVING_AVERAGES[0].color }}
                >
                  {Math.round(selection.volumeAverage).toLocaleString()}
                </span>
              )}
            </>
          )}
        </span>
      )}
    </div>
  );
}
