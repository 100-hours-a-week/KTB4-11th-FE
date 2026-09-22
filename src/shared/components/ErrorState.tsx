"use client";

import type { ComponentType } from "react";

interface ErrorStateProps {
  icon?: ComponentType<{ width?: number; height?: number }>;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  icon: Icon,
  message = "정보를 불러오지 못했어요",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      {Icon && <Icon width={48} height={48} />}
      <div className="flex flex-col items-center gap-1">
        <span className="body-2-medium text-text-neutral-secondary">
          {message}
        </span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-text-accent caption-1-semibold"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
