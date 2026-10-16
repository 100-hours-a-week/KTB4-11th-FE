import MinusIcon from "@/assets/icons/fill/minus.svg";
import PlusIcon from "@/assets/icons/fill/plus.svg";
import type {
  StockPriceMode,
  StockTradeSide,
} from "@/features/stock/types/stockTrade";
import { cn } from "@/shared/utils/cn";

interface StockTradePriceInputProps {
  side: StockTradeSide;
  mode: StockPriceMode;
  price: number;
  priceError?: string | null;
  showAdjust?: boolean;
  onModeChange: (mode: StockPriceMode) => void;
  onFocus: () => void;
  onChange: (value: string) => void;
  onAdjust: (delta: number) => void;
}

export function StockTradePriceInput({
  side,
  mode,
  price,
  priceError,
  showAdjust = true,
  onModeChange,
  onFocus,
  onChange,
  onAdjust,
}: StockTradePriceInputProps) {
  const action = side === "buy" ? "구매" : "판매";
  const modes = [
    { value: "limit", label: `${action}할 가격` },
    { value: "current", label: "현재가" },
    { value: "market", label: "시장가" },
  ] as const;
  return (
    <section
      aria-label="주문 가격"
      className="bg-bg-layer-default shrink-0 rounded-2xl px-6 py-3"
    >
      <div className="body-2-semibold text-text-neutral-secondary flex items-center gap-2">
        {modes.map(({ value, label }, index) => (
          <span key={value} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-text-neutral-tertiary" aria-hidden="true">
                |
              </span>
            )}
            <button
              type="button"
              aria-pressed={mode === value}
              onClick={() => onModeChange(value)}
              className={cn(
                "py-1",
                mode === value && "text-text-neutral-primary font-semibold",
              )}
            >
              {label}
            </button>
          </span>
        ))}
      </div>
      <div className="mt-1 flex h-9 items-center justify-between gap-2">
        {mode === "limit" ? (
          <label className="title-1 flex min-w-0 items-center">
            <input
              type="text"
              inputMode="none"
              autoComplete="off"
              aria-label="주문 가격 입력"
              value={price ? price.toLocaleString() : ""}
              onFocus={onFocus}
              onChange={(event) => onChange(event.target.value)}
              className="title-1 caret-text-accent field-sizing-content max-w-full min-w-0 bg-transparent tabular-nums outline-none"
            />
            <span>원</span>
          </label>
        ) : (
          <span className="title-1 min-w-0 text-left tabular-nums">
            {mode === "market"
              ? "최대한 빠른 가격"
              : `약 ${price.toLocaleString()}원`}
          </span>
        )}
        {mode === "limit" && showAdjust && (
          <div className="text-text-neutral-secondary flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="주문 가격 내리기"
              onClick={() => onAdjust(-500)}
              className="rounded active:bg-gray-50"
            >
              <MinusIcon width={24} height={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="주문 가격 올리기"
              onClick={() => onAdjust(500)}
              className="rounded active:bg-gray-50"
            >
              <PlusIcon width={24} height={24} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {mode === "limit" && priceError && (
        <p className="caption-1-regular text-text-error mt-1">{priceError}</p>
      )}
      {mode !== "limit" && (
        <p className="caption-1-regular text-text-neutral-secondary mt-1">
          {mode === "market"
            ? "바로 체결 가능한 가격으로"
            : "가장 최근에 체결된 가격으로"}{" "}
          {action}해요
        </p>
      )}
    </section>
  );
}
