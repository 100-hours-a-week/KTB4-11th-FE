import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface EmptyStateCardProps {
  children: ReactNode;
  className?: string;
}

export function EmptyStateCard({ children, className }: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        "bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32 max-sm:justify-center max-sm:pt-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
