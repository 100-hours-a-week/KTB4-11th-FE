export function HoldingStockItemSkeleton() {
  return (
    <div className="bg-bg-layer-default flex animate-pulse items-center justify-between rounded-2xl px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="bg-bg-neutral-tertiary size-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <span className="bg-bg-neutral-tertiary h-4 w-24 rounded" />
          <span className="bg-bg-neutral-tertiary h-3.5 w-32 rounded" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="bg-bg-neutral-tertiary h-4 w-16 rounded" />
        <span className="bg-bg-neutral-tertiary h-3.5 w-10 rounded" />
      </div>
    </div>
  );
}
