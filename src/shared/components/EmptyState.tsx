import type { ComponentType } from "react";

interface EmptyStateProps {
  icon: ComponentType<{ width?: number; height?: number }>;
  message: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  message,
  description,
  actionLabel,
  onAction,
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
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="bg-bg-neutral-primary text-text-neutral-inverse caption-1-semibold rounded-r3 px-4 py-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
