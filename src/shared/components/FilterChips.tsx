"use client";

import { cn } from "@/shared/utils/cn";

interface FilterChipsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  scrollable?: boolean;
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  scrollable,
}: FilterChipsProps<T>) {
  return (
    <div
      className={cn(
        "flex gap-1",
        scrollable && "hide-scrollbar overflow-x-auto",
      )}
    >
      {options.map((option) => {
        const isSelected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "body-2-medium rounded-full border px-3 py-1 transition-colors",
              scrollable && "shrink-0",
              isSelected
                ? "bg-bg-neutral-primary border-bg-neutral-primary text-text-neutral-inverse"
                : "bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
