import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface StockPriceSummaryProps {
  name: string;
  price: number;
  changeAmount: number;
  changeRate: number;
}

export function StockPriceSummary({
  name,
  price,
  changeAmount,
  changeRate,
}: StockPriceSummaryProps) {
  const { colorClass } = getReturnRateInfo(changeRate);

  return (
    <div className="flex flex-col gap-1 px-5 pt-2">
      <span className="body-1-semibold text-text-neutral-primary">{name}</span>
      <span className="title-1">{price.toLocaleString()}원</span>
      <span className="body-2-medium text-text-neutral-secondary">
        어제보다{" "}
        <span className={colorClass}>
          {changeAmount >= 0 ? "+" : ""}
          {changeAmount.toLocaleString()}원 ({formatSignedPercent(changeRate)})
        </span>
      </span>
    </div>
  );
}
