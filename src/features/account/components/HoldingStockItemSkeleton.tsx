import { Skeleton } from "@/shared/components/Skeleton";

export function HoldingStockItemSkeleton() {
  return (
    <div className="bg-bg-layer-default flex items-center justify-between rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3.5 w-32" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3.5 w-10" />
      </div>
    </div>
  );
}
