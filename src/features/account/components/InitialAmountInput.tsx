"use client";

import { useRef, useState } from "react";
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
  const fieldRef = useRef<HTMLDivElement>(null);
  const [hasExceededAmount, setHasExceededAmount] = useState(false);

  function updateAmount(next: number) {
    const exceedsLimit = next > MAX_AMOUNT;
    setHasExceededAmount(exceedsLimit);
    if (
      exceedsLimit &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const field = fieldRef.current;
      field?.getAnimations().forEach((animation) => animation.cancel());
      field?.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 300, easing: "ease-out" },
      );
    }
    onChange(Math.min(next, MAX_AMOUNT));
  }

  return (
    <div className="flex flex-col gap-3">
      <div ref={fieldRef} aria-live="polite">
        <InitialAmountField
          value={value.toLocaleString()}
          onChange={(next) => updateAmount(Number(next.replace(/,/g, "")) || 0)}
          aria-invalid={hasExceededAmount || !!error}
          error={hasExceededAmount ? "최대 1억 원까지 입력할 수 있어요" : error}
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
