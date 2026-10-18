// 상세 조회 중 십자선과 날짜·가격 라벨 표시

import type { ChartCrosshair } from "@/features/stock/types/chart";

export function StockChartCrosshair({
  point,
}: {
  point: ChartCrosshair | null;
}) {
  return (
    <>
      {point && (
        <>
          <div
            className="border-border-neutral-secondary absolute top-0 border-l border-dashed"
            style={{ left: point.x, height: point.height }}
          />
          <div
            className="border-border-neutral-secondary absolute left-0 border-t border-dashed"
            style={{ top: point.y, width: point.width }}
          />
          <span
            className="caption-1-regular bg-bg-neutral-primary text-text-neutral-inverse absolute -translate-y-1/2 px-1 py-0.5"
            style={{ left: point.width, top: point.y }}
          >
            {Math.round(point.price).toLocaleString()}
          </span>
          <span
            ref={(element) => {
              if (element)
                element.style.left = `${Math.max(0, Math.min(point.width - element.offsetWidth, point.x - element.offsetWidth / 2))}px`;
            }}
            className="caption-1-regular bg-bg-neutral-primary text-text-neutral-inverse absolute px-1 py-0.5 whitespace-nowrap"
            style={{ top: point.height }}
          >
            {point.date}
          </span>
        </>
      )}
    </>
  );
}
