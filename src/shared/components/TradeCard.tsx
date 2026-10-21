import type { ReactNode } from "react";
import type { Trade } from "@/shared/types/trade";
import { StockLogo } from "@/shared/components/StockLogo";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface TradeCardProps extends Trade {
  children?: ReactNode;
}

export function TradeCard({
  stockCode,
  stockName,
  tradeSide,
  tradeDate,
  quantity,
  price,
  realizedProfit,
  profitRate,
  children,
}: TradeCardProps) {
  const isBuy = tradeSide === "매수";
  const hasRealizedProfit = realizedProfit !== undefined;
  const { sign, colorClass } = getReturnRateInfo(realizedProfit ?? 0);
  const totalAmount = quantity * price;

  return (
    <div className="bg-bg-layer-default flex flex-col gap-2 rounded-2xl px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StockLogo code={stockCode} className="size-10" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="body-1-semibold">{stockName}</span>
              <span
                className={cn(
                  "caption-1-semibold rounded-md px-1.5 py-0.5",
                  isBuy
                    ? "bg-bg-accent text-text-neutral-inverse"
                    : "bg-sky-blue-50 text-text-accent",
                )}
              >
                {tradeSide}
              </span>
            </div>
            <span className="body-2-regular text-text-neutral-secondary flex items-center">
              {tradeDate}
              <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
              {quantity}주
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="body-1-semibold">
            {totalAmount.toLocaleString()}원
          </span>
          {hasRealizedProfit && (
            <span className={cn("body-2-medium", colorClass)}>
              {sign}
              {realizedProfit.toLocaleString()}원{" "}
              {profitRate !== undefined && (
                <span className="caption-1-regular">
                  ({formatSignedPercent(profitRate)})
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
