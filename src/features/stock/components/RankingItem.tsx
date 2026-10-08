"use client";

import HeartFilledIcon from "@/assets/icons/nav/filled/heart.svg";
import HeartOutlineIcon from "@/assets/icons/nav/outline/heart.svg";
import type { RankingStock } from "@/features/stock/types/ranking";
import { cn } from "@/shared/utils/cn";

interface RankingItemProps extends RankingStock {
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
}: RankingItemProps) {
  const isRise = changeRate > 0;
  const isFall = changeRate < 0;
  const HeartIcon = isFavorite ? HeartFilledIcon : HeartOutlineIcon;

  return (
    <div className="bg-bg-layer-default flex items-center gap-3 rounded-2xl px-3 py-2.5">
      <span className="body-2-semibold text-text-neutral-primary w-4 text-center">
        {rank}
      </span>
      <span className="border-border-neutral-tertiary size-9 shrink-0 rounded-full border border-dashed" />
      <div className="flex min-w-0 flex-1 flex-col gap-0">
        <span className="body-2-semibold truncate">{name}</span>
        <span className="flex items-center gap-1">
          <span className="caption-1-regular text-text-neutral-secondary">
            {price.toLocaleString()}원
          </span>
          <span
            className={cn(
              "caption-1-semibold",
              isRise && "text-text-price-rise",
              isFall && "text-text-price-fall",
              !isRise && !isFall && "text-text-price-flat",
            )}
          >
            {isRise ? "+" : ""}
            {changeRate.toFixed(1)}%
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={() => onToggleFavorite(stockCode)}
        aria-label={isFavorite ? "관심 종목 해제" : "관심 종목 등록"}
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
