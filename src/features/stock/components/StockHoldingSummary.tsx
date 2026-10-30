import type { StockHolding } from "@/features/stock/types/stockDetail";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface StockHoldingSummaryProps {
  holding: StockHolding;
}

export function StockHoldingSummary({ holding }: StockHoldingSummaryProps) {
  const { colorClass } = getReturnRateInfo(holding.returnPercent);

  return (
    <div className="flex flex-col gap-2">
      <span className="body-1-bold px-1">보유 현황</span>
      <div className="bg-bg-layer-default divide-border-neutral-muted flex flex-col divide-y rounded-2xl px-4">
        <div className="flex items-center justify-between py-3">
          <span className="caption-1-regular text-text-neutral-secondary">
            평가금액
          </span>
          <span className="body-2-semibold">
            {holding.valuationAmount.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="caption-1-regular text-text-neutral-secondary">
            수익률
          </span>
          <span className={cn("body-2-semibold", colorClass)}>
            {formatSignedPercent(holding.returnPercent)}
          </span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="caption-1-regular text-text-neutral-secondary">
            {holding.quantity}주 · 평단
          </span>
          <span className="body-2-semibold">
            {holding.avgPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
