import { cn } from "@/shared/utils/cn";

export function formatSignedPercent(value: number, digits = 1): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
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
