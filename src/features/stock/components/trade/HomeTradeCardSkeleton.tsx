import { Skeleton } from "@/shared/components/Skeleton";

export function HomeTradeCardSkeleton() {
  return (
    <div className="bg-bg-layer-default flex flex-col gap-1 rounded-2xl p-4">
      <div className="mb-1 flex items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-8" />
      </div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-1 h-4 w-32" />
    </div>
  );
}
