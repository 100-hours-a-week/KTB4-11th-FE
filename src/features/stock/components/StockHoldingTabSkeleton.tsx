import { Skeleton } from "@/shared/components/Skeleton";
import { TradeCardSkeleton } from "@/shared/components/TradeCardSkeleton";

export function StockHoldingSummarySkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <Skeleton className="mx-1 h-5 w-16" />
      <div className="bg-bg-layer-default divide-border-neutral-muted divide-y rounded-2xl px-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center justify-between py-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StockHoldingTabSkeleton() {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-label="내 주식 불러오는 중"
    >
      <StockHoldingSummarySkeleton />
      <div className="flex flex-col gap-2" aria-hidden="true">
        <Skeleton className="mx-1 h-5 w-24" />
        <TradeCardSkeleton />
      </div>
    </div>
  );
}
