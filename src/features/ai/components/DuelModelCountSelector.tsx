"use client";

import { toast } from "sonner";
import LockIcon from "@/assets/icons/fill/lock.svg";
import {
  MODEL_COUNT_OPTIONS,
  type ModelCount,
} from "@/features/ai/schemas/aiVsAiDuelCreationFormSchema";
import { cn } from "@/shared/utils/cn";

const LOCKED_MODEL_COUNT = 4;

interface DuelModelCountSelectorProps {
  value: ModelCount;
  onChange: (value: ModelCount) => void;
}

export function DuelModelCountSelector({
  value,
  onChange,
}: DuelModelCountSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="body-1-bold">비교할 전략 모델 수</span>
      <div className="flex gap-2">
        {MODEL_COUNT_OPTIONS.map((count) => {
          const isSelected = value === count;
          return (
            <button
              key={count}
              type="button"
              onClick={() => onChange(count)}
              className={cn(
                "body-1-semibold flex size-9 items-center justify-center rounded-full border",
                isSelected
                  ? "bg-bg-neutral-primary border-bg-neutral-primary text-text-neutral-inverse"
                  : "bg-bg-layer-default border-border-neutral-muted text-text-neutral-tertiary",
              )}
            >
              {count}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => toast.info("4개 이상 모델 비교는 준비 중이에요")}
          className="bg-bg-layer-default border-border-neutral-muted text-text-neutral-tertiary flex h-9 items-center justify-center gap-0.5 rounded-full border pr-3.5 pl-2.5"
        >
          <LockIcon width={16} height={16} />
          <span className="body-1-semibold">{LOCKED_MODEL_COUNT}</span>
        </button>
      </div>
    </div>
  );
}
