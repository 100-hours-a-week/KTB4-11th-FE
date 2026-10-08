"use client";

import {
  RANKING_TYPES,
  type RankingType,
} from "@/features/stock/types/ranking";
import { cn } from "@/shared/utils/cn";

interface RankingTypeTabsProps {
  value: RankingType;
  onChange: (value: RankingType) => void;
}

export function RankingTypeTabs({ value, onChange }: RankingTypeTabsProps) {
  return (
    <div className="border-border-neutral-muted flex items-center justify-between gap-5 border-b-[0.5px] px-4">
      {RANKING_TYPES.map((type) => {
        const isSelected = value === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "body-1-semibold shrink-0 border-b-2 pb-2 transition-colors duration-200",
              isSelected
                ? "border-border-neutral-primary text-text-neutral-primary"
                : "text-text-neutral-secondary/70 border-transparent",
            )}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}
