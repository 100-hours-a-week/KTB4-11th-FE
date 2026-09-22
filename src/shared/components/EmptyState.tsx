import type { ComponentType } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ width?: number; height?: number }>;
  message: string;
  description?: string;
}

export function EmptyState({
  icon: Icon,
  message,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <Icon width={48} height={48} />
      <div className="flex flex-col items-center gap-1">
        <span className="body-1-semibold text-text-neutral-primary">
          {message}
        </span>
        {description && (
          <span className="body-2-regular text-text-neutral-tertiary text-center">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}
