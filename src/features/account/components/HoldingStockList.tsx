import { HoldingStockItem } from "@/features/account/components/HoldingStockItem";
import type { HoldingStock } from "@/features/account/types/holdingStock";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";

interface HoldingStockListProps {
  stocks: HoldingStock[];
}

export function HoldingStockList({ stocks }: HoldingStockListProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="body-1-bold">보유 주식</span>
      <div className="flex flex-col gap-2">
        {stocks.map((stock) => (
          <HoldingStockItem key={stock.id} {...stock} />
        ))}
      </div>
      <button
        type="button"
        className="text-text-neutral-secondary caption-1-regular flex items-center justify-center gap-0.5 py-1"
      >
        보유 주식 전체 보기
        <ChevronForwardIcon width={12} height={12} />
      </button>
    </div>
  );
}
