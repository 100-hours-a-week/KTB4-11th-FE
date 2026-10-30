"use client";

import { useRouter } from "next/navigation";
import type { HoldingStock } from "@/features/account/types/holdingStock";
import { StockLogo } from "@/shared/components/StockLogo";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

type HoldingStockItemProps = HoldingStock;

export function HoldingStockItem({
  id,
  name,
  category,
  quantity,
  avgPrice,
  value,
  profitAmount,
  changeRate,
}: HoldingStockItemProps) {
  const router = useRouter();
  const { sign, colorClass } = getReturnRateInfo(changeRate);

  return (
    <div
      onClick={() => router.push(`/stock/${id}`)}
      className="bg-bg-layer-default flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3"
    >
      <div className="flex items-center gap-3">
        <StockLogo code={id} className="size-10" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="body-1-semibold">{name}</span>
            <span className="bg-sky-blue-50 text-text-accent caption-1-semibold rounded-md px-1.5 py-0.5">
              {category}
            </span>
          </div>
          <span className="body-2-regular text-text-neutral-secondary flex items-center">
            {quantity}주
            <span className="bg-border-neutral-muted mx-1.5 h-3 w-px" />
            평단 {avgPrice.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="body-1-semibold">{value.toLocaleString()}원</span>
        <span className={cn("body-2-medium", colorClass)}>
          {sign}
          {profitAmount.toLocaleString()}원{" "}
          <span className="caption-1-regular">
            ({formatSignedPercent(changeRate)})
          </span>
        </span>
      </div>
    </div>
  );
}
