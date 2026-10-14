"use client";

import { useState } from "react";
import {
  DUEL_PERIOD_OPTIONS,
  type DuelPeriodOption,
} from "@/features/ai/types/duel";
import InfoIcon from "@/assets/icons/fill/info.svg";
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

const PLACEHOLDER_PERIOD_DAYS = 30;

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
  onEndDateChange: (value: string) => void;
  error?: string;
}

export function DuelPeriodSelector({
  startDate,
  endDate,
  onEndDateChange,
  error,
}: DuelPeriodSelectorProps) {
  const [periodOption, setPeriodOption] = useState<
    DuelPeriodOption | undefined
  >(undefined);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draftEnd, setDraftEnd] = useState<string | undefined>(
    endDate || undefined,
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
  const placeholderEndDate = addDays(today, PLACEHOLDER_PERIOD_DAYS);
  const placeholderEndText = formatDisplayDate(toDateOnly(placeholderEndDate));

  function handlePeriodOptionChange(option: DuelPeriodOption) {
    setPeriodOption(option);
    if (option === RESET_OPTION) {
      onEndDateChange("");
      return;
    }

    const days = PERIOD_DAYS[option]!;
    onEndDateChange(toDateOnly(addDays(today, days)));
  }

  function openSheet() {
    setDraftEnd(endDate || undefined);
    setIsSheetOpen(true);
  }

  function handleConfirm() {
    if (!draftEnd) return;
    setPeriodOption(RESET_OPTION);
    onEndDateChange(draftEnd);
    setIsSheetOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className="body-1-bold">대결 기간</span>
        <div
          className={cn(
            "bg-bg-layer-default flex flex-col gap-2 rounded-2xl border-[1.4px] p-4",
            error ? "border-border-error" : "border-transparent",
          )}
        >
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
              <>
                <span className="body-1-medium">
                  <span className="text-text-neutral-primary">
                    {formatDisplayDate(startDate)} ~{" "}
                  </span>
                  <span className="text-text-neutral-tertiary">
                    {placeholderEndText}
                  </span>
                </span>
                <span className="body-2-medium text-text-neutral-tertiary shrink-0">
                  {PLACEHOLDER_PERIOD_DAYS}일
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-5 gap-1.5">
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
          <button
            type="button"
            onClick={() => handlePeriodOptionChange(RESET_OPTION)}
            className="body-2-medium bg-bg-layer-default border-border-neutral-muted text-text-neutral-secondary active:bg-bg-neutral-primary active:border-bg-neutral-primary active:text-text-neutral-inverse rounded-full border px-2 py-1 transition-colors"
          >
            {RESET_OPTION}
          </button>
        </div>
        {error ? (
          <p className="body-2-regular text-text-error">{error}</p>
        ) : (
          <span className="flex items-center gap-1">
            <InfoIcon
              width={12}
              height={12}
              className="text-text-neutral-tertiary"
            />
            <span className="caption-1-regular text-text-neutral-tertiary">
              대결 시작일은 오늘로 고정돼요
            </span>
          </span>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetPortal>
          <SheetContent>
            <div className="flex flex-col gap-4 p-6">
              <div className="bg-bg-neutral-tertiary mx-auto mb-1 h-1 w-9 rounded-full" />
              <SheetTitle className="sr-only">대결 기간 선택</SheetTitle>
              <Calendar
                rangeStart={startDate}
                rangeEnd={draftEnd}
                minDate={toDateOnly(addDays(today, 1))}
                onSelect={(value) => setDraftEnd(value)}
              />
              <Button disabled={!draftEnd} onClick={handleConfirm}>
                선택 완료
              </Button>
            </div>
          </SheetContent>
        </SheetPortal>
      </Sheet>
    </div>
  );
}
