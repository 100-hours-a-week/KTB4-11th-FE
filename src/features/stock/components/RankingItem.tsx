"use client";

import { useRouter } from "next/navigation";
import HeartFilledIcon from "@/assets/icons/nav/filled/heart.svg";
import HeartOutlineIcon from "@/assets/icons/nav/outline/heart.svg";
import type { RankingStock } from "@/features/stock/types/ranking";
import { StockLogo } from "@/shared/components/StockLogo";
import { cn } from "@/shared/utils/cn";
import {
  formatSignedPercent,
  getReturnRateInfo,
} from "@/shared/utils/getReturnRateInfo";

interface RankingItemProps extends RankingStock {
  favoriteDisabled?: boolean;
  onToggleFavorite: (stockCode: string) => void;
}

export function RankingItem({
  rank,
  stockCode,
  name,
  price,
  changeRate,
  isFavorite,
  onToggleFavorite,
  favoriteDisabled = false,
}: RankingItemProps) {
  const router = useRouter();
  const { colorClass } = getReturnRateInfo(changeRate ?? 0);
  const HeartIcon = isFavorite ? HeartFilledIcon : HeartOutlineIcon;

  return (
    <div
      onClick={() => router.push(`/stock/${stockCode}`)}
      className="bg-bg-layer-default flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5"
    >
      {rank !== undefined && (
        <span className="body-2-semibold text-text-neutral-primary w-4 text-center">
          {rank}
        </span>
      )}
      <StockLogo code={stockCode} className="size-9" />
      <div className="flex min-w-0 flex-1 flex-col gap-0">
        <span className="body-2-semibold truncate">{name}</span>
        <span className="flex items-center gap-1">
          <span className="caption-1-regular text-text-neutral-secondary">
            {price === null ? "—" : `${price.toLocaleString()}원`}
          </span>
          <span className={cn("caption-1-semibold", colorClass)}>
            {changeRate === null ? "—" : formatSignedPercent(changeRate)}
          </span>
        </span>
      </div>
      <button
        type="button"
        disabled={favoriteDisabled}
        onClick={(event) => {
          event.stopPropagation();
          onToggleFavorite(stockCode);
        }}
        aria-label={
          isFavorite === undefined
            ? "관심 종목 변경"
            : isFavorite
              ? "관심 종목 해제"
              : "관심 종목 등록"
        }
      >
        <HeartIcon
          width={21}
          height={21}
          className={
            isFavorite ? "text-icon-accent" : "text-icon-neutral-secondary"
          }
        />
      </button>
    </div>
  );
}
