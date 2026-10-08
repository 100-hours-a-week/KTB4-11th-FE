"use client";

import { useEffect, useRef } from "react";
import { RankingItem } from "@/features/stock/components/RankingItem";
import type { RankingStock } from "@/features/stock/types/ranking";

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
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore]);

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
