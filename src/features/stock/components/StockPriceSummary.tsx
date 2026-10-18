import { AnimatedPriceText } from "@/shared/components/AnimatedPriceText";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface StockPriceSummaryProps {
  comparisonLabel?: string;
  name: string;
  price: number;
  changeAmount: number;
  changeRate: number;
}

export function StockPriceSummary({
  comparisonLabel = "어제보다",
  name,
  price,
  changeAmount,
  changeRate,
}: StockPriceSummaryProps) {
  const { colorClass } = getReturnRateInfo(changeRate);

  return (
    <div className="flex flex-col gap-1 px-5 pt-2">
      <span className="body-1-semibold text-text-neutral-primary">{name}</span>
      <AnimatedPriceText
        className="title-1"
        text={`${price.toLocaleString()}원`}
      />
      <span className="body-2-medium text-text-neutral-secondary flex items-baseline gap-1">
        {comparisonLabel}
        <AnimatedPriceText
          className={colorClass}
          text={`${changeAmount >= 0 ? "+" : ""}${changeAmount.toLocaleString()}원 (${formatSignedPercent(changeRate)})`}
        />
      </span>
    </div>
  );
}
