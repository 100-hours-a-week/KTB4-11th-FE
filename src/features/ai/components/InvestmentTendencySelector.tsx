"use client";

import { TENDENCY_DOT_COLORS } from "@/features/ai/constants/investmentTendencyColors";
import {
  INVESTMENT_TENDENCIES,
  type InvestmentTendency,
} from "@/features/ai/types/aiStrategy";
import { cn } from "@/shared/utils/cn";

const TENDENCY_DOT_MUTED_COLORS: Record<InvestmentTendency, string> = {
  성장형: "bg-red-200",
  성장추구형: "bg-orange-200",
  위험중립형: "bg-yellow-200",
  안정추구형: "bg-green-200",
  안정형: "bg-blue-200",
};

type InvestmentTendencySelectorProps = {
  value: InvestmentTendency;
  size?: "default" | "sm";
  showLabel?: boolean;
} & (
  | { readOnly: true; onChange?: never }
  | { readOnly?: false; onChange: (value: InvestmentTendency) => void }
);

export function InvestmentTendencySelector({
  value,
  onChange,
  readOnly = false,
  size = "default",
  showLabel = true,
}: InvestmentTendencySelectorProps) {
  const isSmall = size === "sm";

  return (
    <div className="flex flex-col gap-3">
      {showLabel && <span className="body-1-bold">투자 성향</span>}
      <div
        role={readOnly ? "img" : "group"}
        aria-label={
          readOnly
            ? `투자 성향: ${value}, 성장형부터 안정형까지 5단계`
            : "투자 성향"
        }
        className={cn(
          "relative",
          isSmall
            ? "grid grid-cols-5 gap-1 pt-1"
            : "flex items-center justify-between",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute h-px",
            isSmall
              ? "bg-border-neutral-muted inset-x-[10%] top-2"
              : "bg-bg-layer-default inset-x-2 top-1.5",
          )}
        />
        {INVESTMENT_TENDENCIES.map((tendency) => {
          const isSelected = value === tendency;
          const content = (
            <>
              <span
                className={cn(
                  "shrink-0 rounded-full transition-transform motion-reduce:transition-none",
                  isSmall ? "size-2" : "size-3",
                  isSelected
                    ? [
                        TENDENCY_DOT_COLORS[tendency],
                        "scale-125",
                        isSmall && "ring-2 ring-white",
                      ]
                    : TENDENCY_DOT_MUTED_COLORS[tendency],
                )}
              />
              <span
                className={cn(
                  "text-center",
                  isSmall
                    ? isSelected
                      ? "caption-1-semibold"
                      : "text-[10px] leading-4"
                    : "caption-1-regular",
                  isSelected
                    ? "text-text-neutral-primary"
                    : "text-text-neutral-secondary",
                )}
              >
                {tendency}
              </span>
            </>
          );
          const className = "relative flex min-w-0 flex-col items-center gap-2";

          return readOnly ? (
            <div key={tendency} aria-hidden="true" className={className}>
              {content}
            </div>
          ) : (
            <button
              key={tendency}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange?.(tendency)}
              className={className}
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
