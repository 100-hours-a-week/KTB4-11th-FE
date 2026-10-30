"use client";

import { useInputFeedback } from "@/shared/hooks/useInputFeedback";
import {
  MAX_AMOUNT,
  MIN_AMOUNT,
} from "@/features/account/schemas/accountCreationFormSchema";
import { InitialAmountField } from "./InitialAmountField";
import { InitialAmountSlider } from "./InitialAmountSlider";
import { QuickAmountChips } from "./QuickAmountChips";

interface InitialAmountInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function InitialAmountInput({
  value,
  onChange,
  error,
}: InitialAmountInputProps) {
  const { feedbackRef, errorMessage, isErrorFading, showError, clearError } =
    useInputFeedback();

  function updateAmount(next: number) {
    if (next > MAX_AMOUNT) showError("최대 1억 원까지 입력할 수 있어요");
    else clearError();
    onChange(Math.min(next, MAX_AMOUNT));
  }

  return (
    <div className="flex flex-col gap-3">
      <div ref={feedbackRef} aria-live="polite">
        <InitialAmountField
          value={value.toLocaleString()}
          onChange={(next) => updateAmount(Number(next.replace(/,/g, "")) || 0)}
          aria-invalid={!!errorMessage || !!error}
          error={errorMessage ?? error}
          errorFading={isErrorFading && !error}
        />
      </div>
      <QuickAmountChips
        onAdd={(amount) => updateAmount(value + amount)}
        onManualInput={() => updateAmount(0)}
      />
      <InitialAmountSlider
        value={value}
        onValueChange={updateAmount}
        min={MIN_AMOUNT}
        max={MAX_AMOUNT}
        minLabel="100만"
        maxLabel="1억"
      />
    </div>
  );
}
