"use client";

import { useState } from "react";
import {
  DUEL_PERIOD_OPTIONS,
  type DuelPeriodOption,
} from "@/features/ai/types/duel";
import { useDateRangeDraft } from "@/features/ai/hooks/useDateRangeDraft";
import { Button } from "@/shared/components/Button";
import { Calendar } from "@/shared/components/Calendar";
import {
  Sheet,
  SheetContent,
  SheetPortal,
  SheetTitle,
} from "@/shared/components/Sheet";
import { cn } from "@/shared/utils/cn";
import { toDateOnly } from "@/shared/utils/toDateOnly";

const RESET_OPTION: DuelPeriodOption = "다시 입력";
const PRESET_OPTIONS = DUEL_PERIOD_OPTIONS.filter(
  (option) => option !== RESET_OPTION,
);

const PERIOD_DAYS: Partial<Record<DuelPeriodOption, number>> = {
  "1주": 7,
  "2주": 14,
  "1개월": 30,
  "3개월": 90,
};

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDisplayDate(value: string) {
  return value.replaceAll("-", ". ");
}

interface DuelPeriodSelectorProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  error?: string;
}

export function DuelPeriodSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
}: DuelPeriodSelectorProps) {
  const [periodOption, setPeriodOption] = useState<DuelPeriodOption>("1개월");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { draftStart, draftEnd, selectDay, reset } = useDateRangeDraft(
    startDate,
    endDate,
  );

  const hasPeriod = !!startDate && !!endDate;
  const totalDays =
    startDate && endDate
      ? Math.round(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  const today = new Date();
  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);
  const placeholderText = `${formatDisplayDate(toDateOnly(today))} ~ ${formatDisplayDate(toDateOnly(weekLater))}`;

  function handlePeriodOptionChange(option: DuelPeriodOption) {
    setPeriodOption(option);
    if (option === RESET_OPTION) {
      onStartDateChange("");
      onEndDateChange("");
      return;
    }

    const days = PERIOD_DAYS[option]!;
    onStartDateChange(toDateOnly(today));
    onEndDateChange(toDateOnly(addDays(today, days)));
  }

  function openSheet() {
    reset(startDate, endDate);
    setIsSheetOpen(true);
  }

  function handleConfirm() {
    if (!draftStart || !draftEnd) return;
    setPeriodOption(RESET_OPTION);
    onStartDateChange(draftStart);
    onEndDateChange(draftEnd);
    setIsSheetOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className="body-1-bold">대결 기간</span>
        {error && (
          <p className="text-text-error text-[10px] leading-[14px] font-light">
            {error}
          </p>
        )}
        <div className="bg-bg-layer-default flex flex-col gap-2 rounded-2xl p-4">
          <button
            type="button"
            onClick={openSheet}
            className="flex items-center justify-between gap-2 text-left"
          >
            {hasPeriod ? (
              <>
                <span className="body-1-medium text-text-neutral-primary">
                  {formatDisplayDate(startDate)} ~ {formatDisplayDate(endDate)}
                </span>
                <span className="body-2-medium text-text-neutral-secondary shrink-0">
                  {totalDays}일
                </span>
              </>
            ) : (
              <span className="body-1-medium text-text-neutral-tertiary">
                {placeholderText}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-1.5">
        <div className="grid flex-1 grid-cols-4 gap-1.5">
          {PRESET_OPTIONS.map((preset) => {
            const isSelected = periodOption === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handlePeriodOptionChange(preset)}
                className={cn(
                  "body-2-medium rounded-full border px-2 py-1 transition-colors",
                  isSelected
                    ? "bg-bg-neutral-primary border-bg-neutral-primary text-text-neutral-inverse"
                    : "bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary",
                )}
              >
                {preset}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => handlePeriodOptionChange(RESET_OPTION)}
          className="body-2-medium bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary active:bg-bg-neutral-primary active:border-bg-neutral-primary active:text-text-neutral-inverse shrink-0 rounded-full border px-3 py-1 transition-colors"
        >
          {RESET_OPTION}
        </button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetPortal>
          <SheetContent>
            <div className="flex flex-col gap-4 p-6">
              <div className="bg-bg-neutral-tertiary mx-auto mb-1 h-1 w-9 rounded-full" />
              <SheetTitle className="sr-only">대결 기간 선택</SheetTitle>
              <Calendar
                rangeStart={draftStart}
                rangeEnd={draftEnd}
                minDate={toDateOnly(new Date())}
                onSelect={selectDay}
              />
              <Button
                disabled={!draftStart || !draftEnd}
                onClick={handleConfirm}
              >
                선택 완료
              </Button>
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    </div>
  );
}
