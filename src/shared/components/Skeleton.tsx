import { cn } from "@/shared/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-bg-neutral-tertiary block animate-pulse rounded",
        className,
      )}
    />
  );
}
