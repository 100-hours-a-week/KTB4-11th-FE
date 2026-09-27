"use client";

import type { ComponentType } from "react";
import WarningIcon from "@/assets/icons/fill/warning.svg";

interface ErrorStateProps {
  icon?: ComponentType<{ width?: number; height?: number; className?: string }>;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  icon: Icon = WarningIcon,
  message = "정보를 불러오지 못했어요",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <Icon width={40} height={35} className="text-icon-warning" />
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
