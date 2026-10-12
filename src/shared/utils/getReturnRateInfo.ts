import { cn } from "@/shared/utils/cn";

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
