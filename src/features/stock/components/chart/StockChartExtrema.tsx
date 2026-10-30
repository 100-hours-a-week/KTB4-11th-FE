// 최고·최저 라벨과 화살표 표시, 경계 안으로 위치 보정

import ArrowDownIcon from "@/assets/icons/outline/arrow-down.svg";
import { cn } from "@/shared/utils/cn";

import type { ChartExtreme } from "@/features/stock/types/chart";

export function StockChartExtrema({
  points,
  textClassName = "caption-1-regular",
}: {
  points: ChartExtreme[];
  textClassName?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {points.map((point) => (
        <div key={point.key}>
          {point.arrow && (
            <ArrowDownIcon
              width={12}
              height={12}
              className="absolute -translate-x-1/2"
              style={{
                left: point.anchorX,
                top: (point.anchorY ?? 0) + (point.high ? -12 : 0),
                color: point.color,
                transform: point.high ? undefined : "rotate(180deg)",
              }}
            />
          )}
          <div
            key={point.key}
            ref={(element) => {
              if (!element?.parentElement) return;
              const width =
                point.boundsWidth ?? element.parentElement.clientWidth;
              element.style.left = `${Math.max(0, Math.min(point.x, width - element.scrollWidth))}px`;
            }}
            className={cn(
              "absolute max-w-full whitespace-nowrap",
              textClassName,
            )}
            style={{ left: point.x, top: point.y, color: point.color }}
          >
            <span
              className={cn(
                "block",
                point.high ? "-translate-y-full" : "translate-y-1",
              )}
            >
              {point.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
