import { HoldingStockItem } from "@/features/account/components/HoldingStockItem";
import type { HoldingStock } from "@/features/account/types/holdingStock";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";

interface HoldingStockListProps {
  stocks: HoldingStock[];
  isError?: boolean;
  onRetry?: () => void;
}

export function HoldingStockList({
  stocks,
  isError,
  onRetry,
}: HoldingStockListProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="body-1-bold">보유 주식</span>
      {isError ? (
        <div className="bg-bg-layer-default rounded-2xl">
          <ErrorState onRetry={onRetry} />
        </div>
      ) : stocks.length === 0 ? (
        <div className="bg-bg-layer-default rounded-2xl">
          <EmptyState
            icon={BasketFlusteredIcon}
            message="아직 보유한 종목이 없어요"
            description="AI 매매가 체결되면 보유 종목이 여기 표시돼요"
          />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
