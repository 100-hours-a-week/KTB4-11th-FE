import { Skeleton } from "@/shared/components/Skeleton";

export function DuelCardSkeleton() {
  return (
    <div className="bg-bg-layer-default flex flex-col gap-2 rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-12 rounded" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  );
}
