"use client";

import LockIcon from "@/assets/icons/fill/lock.svg";
import { cn } from "@/shared/utils/cn";

export const DUEL_PORTFOLIO_OPTIONS = [
  "내 포트폴리오",
  "AI 포트폴리오",
] as const;
export type DuelPortfolioOption = (typeof DUEL_PORTFOLIO_OPTIONS)[number];

interface DuelPortfolioToggleProps {
  value: DuelPortfolioOption;
  onChange: (value: DuelPortfolioOption) => void;
  isAiLocked?: boolean;
  onLockedClick?: () => void;
}

export function DuelPortfolioToggle({
  value,
  onChange,
  isAiLocked,
  onLockedClick,
}: DuelPortfolioToggleProps) {
  return (
    <div className="flex items-center gap-1">
      {DUEL_PORTFOLIO_OPTIONS.map((option) => {
        const isSelected = value === option;
        const isLocked = isAiLocked && option === "AI 포트폴리오";

        return (
          <button
            key={option}
            type="button"
            onClick={() => (isLocked ? onLockedClick?.() : onChange(option))}
            className={cn(
              "body-2-medium flex items-center gap-1 rounded-full border px-3 py-1 transition-colors",
              isSelected
                ? "bg-bg-neutral-primary border-bg-neutral-primary text-text-neutral-inverse"
                : "bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary",
            )}
          >
            {isLocked && <LockIcon width={16} height={16} />}
            {option}
          </button>
        );
      })}
    </div>
  );
}
