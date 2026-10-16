"use client";

import { cn } from "@/shared/utils/cn";

interface TabsProps<T extends string> {
  tabs: readonly T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={cn(
        "border-border-neutral-muted flex items-center gap-5 border-b-[0.5px] px-5",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isSelected = value === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              "body-1-semibold shrink-0 border-b-2 pb-2 transition-colors duration-200",
              isSelected
                ? "border-border-neutral-primary text-text-neutral-primary"
                : "text-text-neutral-secondary/70 border-transparent",
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
