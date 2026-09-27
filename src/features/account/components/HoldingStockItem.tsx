import type { HoldingStock } from "@/features/account/types/holdingStock";
import { cn } from "@/shared/utils/cn";

type HoldingStockItemProps = Omit<HoldingStock, "id">;

export function HoldingStockItem({
  name,
  category,
  quantity,
  avgPrice,
  value,
  changeRate,
}: HoldingStockItemProps) {
  const isRise = changeRate > 0;
  const isFall = changeRate < 0;

  return (
    <div className="bg-bg-layer-default flex items-center justify-between rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="border-border-neutral-tertiary size-10 rounded-full border border-dashed" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="body-1-semibold">{name}</span>
            <span className="bg-sky-blue-50 text-text-accent caption-1-semibold rounded-md px-1.5 py-0.5">
              {category}
            </span>
          </div>
          <span className="body-2-regular text-text-neutral-secondary">
            {quantity}주 · 평단 {avgPrice.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="body-1-semibold">{value.toLocaleString()}원</span>
        <span
          className={cn(
            "body-2-medium",
            isRise && "text-text-price-rise",
            isFall && "text-text-price-fall",
            !isRise && !isFall && "text-text-price-flat",
          )}
        >
          {isRise ? "+" : ""}
          {changeRate}%
        </span>
      </div>
    </div>
  );
}
