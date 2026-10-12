import Image from "next/image";
import stockSpoonLogo from "@/assets/images/stockspoon-logo.png";
import { cn } from "@/shared/utils/cn";
import { getReturnRateInfo } from "@/shared/utils/getReturnRateInfo";

interface StockTickerBarProps {
  title: string;
  logo?: boolean;
  kospi?: {
    value: number;
    changeRate: number;
  };
}

export function StockTickerBar({
  title,
  logo = true,
  kospi,
}: StockTickerBarProps) {
  const { sign, colorClass } = getReturnRateInfo(kospi?.changeRate ?? 0);

  return (
    <div className="flex items-center gap-2 px-5 py-3">
      {logo ? (
        <>
          <Image src={stockSpoonLogo} alt={title} className="h-9 w-auto" />
          <span className="sr-only">{title}</span>
        </>
      ) : (
        <span className="heading-1-bold">{title}</span>
      )}
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
                colorClass,
              )}
            >
              <span className="body-2-semibold">
                {kospi.value.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="body-2-medium">
                {sign}
                {kospi.changeRate.toFixed(2)}%
              </span>
            </span>
          </span>
        </span>
      )}
    </div>
  );
}
