"use client";

// 분봉 간격 선택 시트와 일·주·월·년 칩

import { useState } from "react";
import CheckCircleIcon from "@/assets/icons/fill/check-circle.svg";
import ChevronDownIcon from "@/assets/icons/fill/chevron-down.svg";
import {
  CHART_GRANULARITIES,
  CHART_MINUTES,
  isMinuteChart,
  type ChartGranularity,
  type ChartMinute,
} from "@/features/stock/utils/chart/chartPeriod";
import {
  Sheet,
  SheetContent,
  SheetHandle,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/Sheet";
import { cn } from "@/shared/utils/cn";

export function StockChartIntervalChips({
  value,
  minute,
  onChange,
}: {
  value: ChartGranularity;
  minute: ChartMinute;
  onChange: (value: ChartGranularity) => void;
}) {
  const [open, setOpen] = useState(false);
  const chipClass = (selected: boolean) =>
    cn(
      "body-2-semibold rounded-full border px-2 py-1 transition-colors",
      selected
        ? "bg-bg-neutral-primary border-bg-neutral-primary text-text-neutral-inverse"
        : "bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary",
    );
  return (
    <div className="grid grid-cols-5 gap-1.5">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              chipClass(isMinuteChart(value)),
              "flex items-center justify-center gap-1",
            )}
          >
            {minute}
            <ChevronDownIcon width={8} height={8} />
          </button>
        </SheetTrigger>
        <SheetPortal>
          <SheetContent
            aria-describedby={undefined}
            className="overflow-y-auto px-5 pt-5 pb-8"
          >
            <SheetHandle className="mb-3" />
            <SheetTitle className="sr-only">분봉 간격 선택</SheetTitle>
            <div className="flex flex-col" role="group" aria-label="분봉 간격">
              {CHART_MINUTES.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={minute === option}
                  className="body-1-medium text-text-neutral-primary flex items-center justify-between py-3"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                  {minute === option && (
                    <CheckCircleIcon
                      width={24}
                      height={24}
                      className="text-bg-accent"
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
      {CHART_GRANULARITIES.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          className={chipClass(value === option)}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
