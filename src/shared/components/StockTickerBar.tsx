import { cn } from "@/shared/utils/cn";

interface StockTickerBarProps {
  title: string;
  kospi?: {
    value: number;
    changeRate: number;
  };
}

export function StockTickerBar({ title, kospi }: StockTickerBarProps) {
  const isRise = kospi !== undefined && kospi.changeRate > 0;
  const isFall = kospi !== undefined && kospi.changeRate < 0;

  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="title-1">{title}</span>
      {kospi && (
        <span
          className={cn(
            "body-2-medium",
            isRise && "text-text-price-rise",
            isFall && "text-text-price-fall",
            !isRise && !isFall && "text-text-price-flat",
          )}
        >
          KOSPI {kospi.value.toLocaleString()} {isRise ? "+" : ""}
          {kospi.changeRate}%
        </span>
      )}
    </div>
  );
}
