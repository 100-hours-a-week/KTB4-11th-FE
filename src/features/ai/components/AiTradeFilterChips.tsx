"use client";

import { cn } from "@/shared/utils/cn";

const FILTERS = ["전체", "매수", "매도"] as const;

export type AiTradeFilterValue = (typeof FILTERS)[number];

interface AiTradeFilterChipsProps {
  value: AiTradeFilterValue;
  onChange: (value: AiTradeFilterValue) => void;
}

export function AiTradeFilterChips({
  value,
  onChange,
}: AiTradeFilterChipsProps) {
  return (
    <div className="flex gap-2">
      {FILTERS.map((filter) => {
        const isSelected = value === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={cn(
              "body-2-medium rounded-full border px-3 py-1 transition-colors",
              isSelected
                ? "bg-bg-neutral-primary border-bg-neutral-primary text-text-neutral-inverse"
                : "bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary",
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
