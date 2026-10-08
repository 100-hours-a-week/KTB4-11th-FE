"use client";

import { RankingItem } from "@/features/stock/components/RankingItem";
import type { RankingStock } from "@/features/stock/types/ranking";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

interface RankingListProps {
  items: RankingStock[];
  hasMore: boolean;
  onLoadMore: () => void;
  onToggleFavorite: (stockCode: string) => void;
}

export function RankingList({
  items,
  hasMore,
  onLoadMore,
  onToggleFavorite,
}: RankingListProps) {
  const sentinelRef = useInfiniteScroll({ hasMore, onLoadMore });

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <RankingItem
          key={item.stockCode}
          {...item}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
      {hasMore && <div ref={sentinelRef} className="h-1" />}
    </div>
  );
}
