import { cn } from "@/shared/utils/cn";

const MAX_SIGNIFICANT_DIGITS = 10;

export function formatSignedPercent(value: number, digits = 1): string {
  let precision = digits;
  while (
    value !== 0 &&
    Number(value.toFixed(precision)) === 0 &&
    precision < MAX_SIGNIFICANT_DIGITS
  ) {
    precision++;
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(precision)}%`;
}

export function getReturnRateInfo(returnRate: number) {
  const isRise = returnRate > 0;
  const isFall = returnRate < 0;

  return {
    isRise,
    isFall,
    sign: isRise ? "+" : "",
    colorClass: cn(
      isRise && "text-text-price-rise",
      isFall && "text-text-price-fall",
      !isRise && !isFall && "text-text-price-flat",
    ),
  };
}
