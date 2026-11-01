"use client";

import { useState } from "react";
import { AI_STRATEGY_THEME_PREVIEW_COUNT } from "@/features/ai/constants/aiStrategyThemes";
import { cn } from "@/shared/utils/cn";

interface ThemeMultiSelectProps {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function ThemeMultiSelect({
  label,
  options,
  value,
  onChange,
}: ThemeMultiSelectProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleOptions = isExpanded
    ? options
    : options.slice(0, AI_STRATEGY_THEME_PREVIEW_COUNT);

  function toggleTheme(theme: string) {
    onChange(
      value.includes(theme)
        ? value.filter((selected) => selected !== theme)
        : [...value, theme],
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="body-1-bold">{label}</span>
      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((theme) => {
          const isSelected = value.includes(theme);

          return (
            <button
              key={theme}
              type="button"
              onClick={() => toggleTheme(theme)}
              className={cn(
                "body-2-medium rounded-full border px-3 py-1.5 transition-colors",
                isSelected
                  ? "bg-bg-neutral-primary border-bg-neutral-primary text-text-neutral-inverse"
                  : "bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary",
              )}
            >
              {theme}
            </button>
          );
        })}
      </div>
      {!isExpanded && options.length > AI_STRATEGY_THEME_PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="body-2-medium text-text-neutral-secondary self-center"
        >
          더보기
        </button>
      )}
    </div>
  );
}
