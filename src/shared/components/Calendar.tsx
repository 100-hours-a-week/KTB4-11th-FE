"use client";

import { useState } from "react";
import ChevronBackwardIcon from "@/assets/icons/fill/chevron-backward.svg";
import ChevronForwardIcon from "@/assets/icons/fill/chevron-forward.svg";
import { cn } from "@/shared/utils/cn";
import { toDateOnly } from "@/shared/utils/toDateOnly";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

interface CalendarProps {
  rangeStart?: string;
  rangeEnd?: string;
  onSelect: (date: string) => void;
  minDate?: string;
}

export function Calendar({
  rangeStart,
  rangeEnd,
  onSelect,
  minDate,
}: CalendarProps) {
  const initial = rangeStart ? parseDateOnly(rangeStart) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const todayValue = toDateOnly(new Date());
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewYear((year) => year - 1);
      setViewMonth(11);
    } else {
      setViewMonth((month) => month - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewYear((year) => year + 1);
      setViewMonth(0);
    } else {
      setViewMonth((month) => month + 1);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button type="button" onClick={goToPrevMonth} aria-label="이전 달">
          <ChevronBackwardIcon
            width={20}
            height={20}
            className="text-icon-neutral-secondary"
          />
        </button>
        <span className="body-1-semibold">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button type="button" onClick={goToNextMonth} aria-label="다음 달">
          <ChevronForwardIcon
            width={20}
            height={20}
            className="text-icon-neutral-secondary"
          />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            className="caption-1-regular text-text-neutral-tertiary flex h-8 items-center justify-center"
          >
            {weekday}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, index) => {
          if (day === null) return <span key={`blank-${index}`} />;

          const value = toDateOnly(new Date(viewYear, viewMonth, day));
          const isStart = value === rangeStart;
          const isEnd = value === rangeEnd;
          const isEndpoint = isStart || isEnd;
          const isInRange =
            !!rangeStart &&
            !!rangeEnd &&
            value > rangeStart &&
            value < rangeEnd;
          const isToday = value === todayValue;
          const isDisabled = minDate !== undefined && value < minDate;

          return (
            <div
              key={value}
              className="relative flex h-9 items-center justify-center"
            >
              {isInRange && <div className="bg-sky-blue-50 absolute inset-0" />}
              {isStart && rangeEnd && (
                <div className="bg-sky-blue-50 absolute inset-y-0 right-0 w-1/2" />
              )}
              {isEnd && rangeStart && (
                <div className="bg-sky-blue-50 absolute inset-y-0 left-0 w-1/2" />
              )}
              {isEndpoint && (
                <div className="bg-sky-blue-50 absolute inset-0 m-auto size-10 rounded-full" />
              )}
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect(value)}
                className={cn(
                  "body-2-medium relative z-10 flex size-9 items-center justify-center rounded-full transition-colors",
                  isEndpoint
                    ? "bg-bg-accent text-text-neutral-inverse"
                    : "text-text-neutral-primary",
                  !isEndpoint && isToday && "text-text-accent",
                  isDisabled && "text-text-neutral-tertiary",
                  !isDisabled && !isEndpoint && "active:bg-bg-neutral-tertiary",
                )}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
