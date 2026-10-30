import { Skeleton } from "@/shared/components/Skeleton";

export function RankingItemSkeleton() {
  return (
    <div className="bg-bg-layer-default flex items-center gap-3 rounded-2xl px-3 py-2.5">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="size-9 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3.5 w-28" />
      </div>
      <Skeleton className="size-5 rounded-full" />
    </div>
  );
}
