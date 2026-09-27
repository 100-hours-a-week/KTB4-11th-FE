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
        <span className="flex items-center gap-1">
          <span className="body-2-medium text-text-neutral-secondary">
            코스피
          </span>
          <span className="overflow-hidden">
            <span
              key={`${kospi.value}-${kospi.changeRate}`}
              className={cn(
                "animate-in slide-in-from-bottom-2 fade-in flex items-center gap-1 tabular-nums duration-300",
                isRise && "text-text-price-rise",
                isFall && "text-text-price-fall",
                !isRise && !isFall && "text-text-price-flat",
              )}
            >
              <span className="body-2-semibold">
                {kospi.value.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="body-2-medium">
                {isRise ? "+" : ""}
                {kospi.changeRate.toFixed(2)}%
              </span>
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
