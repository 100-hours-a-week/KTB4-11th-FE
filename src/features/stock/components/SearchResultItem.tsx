import type { RankingStock } from "@/features/stock/types/ranking";
import { StockLogo } from "@/shared/components/StockLogo";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface SearchResultItemProps extends Pick<
  RankingStock,
  "stockCode" | "name" | "sector" | "price" | "changeRate"
> {
  onClick: () => void;
}

export function SearchResultItem({
  stockCode,
  name,
  sector,
  price,
  changeRate,
  onClick,
}: SearchResultItemProps) {
  const { colorClass } = getReturnRateInfo(changeRate ?? 0);

  return (
    <div
      onClick={onClick}
      className="bg-bg-layer-default flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5"
    >
      <StockLogo code={stockCode} className="size-9" />
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <span className="body-2-semibold truncate">{name}</span>
        {sector && (
          <span className="bg-sky-blue-50 text-text-accent caption-1-semibold shrink-0 rounded px-1 py-0.5">
            {sector}
          </span>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span className="body-2-semibold">
          {price === null ? "—" : `${price.toLocaleString()}원`}
        </span>
        <span className={cn("caption-1-semibold", colorClass)}>
          {changeRate === null ? "—" : formatSignedPercent(changeRate)}
        </span>
      </div>
    </div>
  );
}
