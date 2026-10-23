import type { RefObject } from "react";
import { cn } from "@/shared/utils/cn";

interface StockTradeQuantityInputProps {
  action: string;
  quantity: number;
  description: string;
  feedbackRef?: RefObject<HTMLSpanElement | null>;
  errorMessage?: string | null;
  isErrorFading?: boolean;
  onFocus: () => void;
  onChange: (value: string) => void;
}

export function StockTradeQuantityInput({
  action,
  quantity,
  description,
  feedbackRef,
  errorMessage,
  isErrorFading,
  onFocus,
  onChange,
}: StockTradeQuantityInputProps) {
  return (
    <label className="bg-bg-layer-default flex w-full shrink-0 flex-col gap-1.5 rounded-2xl px-6 py-4 text-left">
      <span className="body-2-semibold text-text-neutral-primary">수량</span>
      <span className="title-1 flex min-w-0 items-center">
        <input
          aria-label="주문 수량 입력"
          aria-invalid={!!errorMessage}
          type="text"
          inputMode="none"
          autoComplete="off"
          value={quantity ? quantity.toLocaleString() : ""}
          placeholder={`몇 주 ${action}할까요?`}
          onFocus={onFocus}
          onChange={(event) => onChange(event.target.value)}
          className="title-1 text-text-neutral-primary placeholder:text-text-neutral-tertiary caret-text-accent field-sizing-content max-w-full min-w-0 bg-transparent tabular-nums outline-none"
        />
        {quantity > 0 && <span>주</span>}
      </span>
      <span
        ref={feedbackRef}
        className={cn(
          "caption-1-regular transition-opacity duration-200 motion-reduce:transition-none",
          errorMessage ? "text-text-error" : "text-text-neutral-secondary",
          errorMessage && isErrorFading && "opacity-0",
        )}
        aria-live="polite"
      >
        {errorMessage ?? description}
      </span>
    </label>
  );
}
