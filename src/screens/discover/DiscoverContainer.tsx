"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { RankingList } from "@/features/stock/components/RankingList";
import { RankingItemSkeleton } from "@/features/stock/components/RankingItemSkeleton";
import { RankingTypeTabs } from "@/features/stock/components/RankingTypeTabs";
import { SearchInput } from "@/features/stock/components/SearchInput";
import { useRankingQuery } from "@/features/stock/hooks/useRankingQuery";
import { useToggleFavoriteMutation } from "@/features/stock/hooks/useToggleFavoriteMutation";
import type { RankingType } from "@/features/stock/types/ranking";
import { toRankingStock } from "@/features/stock/utils/toRankingStock";
import { useKospiIndexQuery } from "@/features/stock/hooks/useKospiIndexQuery";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header } from "@/shared/components/Header";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { trackEvent } from "@/shared/utils/analytics";

export function DiscoverContainer() {
  const { data: kospi } = useKospiIndexQuery();
  const [rankingType, setRankingType] = useState<RankingType>("거래대금");

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRankingQuery(rankingType);
  const toggleFavorite = useToggleFavoriteMutation();

  const ranking = (data?.pages ?? []).flatMap((page) =>
    page.items.map(toRankingStock),
  );

  function handleToggleFavorite(stockCode: string) {
    const target = ranking.find((item) => item.stockCode === stockCode);
    if (!target) return;

    toggleFavorite.mutate({
      stockCode,
      isFavorite: target.isFavorite,
    });
  }

  return (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
      <Header
        className="px-5"
        right={
          <>
            <button
              type="button"
              onClick={() => {
                trackEvent("unsupported_feature_click", {
                  feature_name: "search",
                });
                toast.info("검색 기능은 v2에서 이용할 수 있어요");
              }}
            >
              <SearchIcon
                width={24}
                height={24}
                className="text-icon-neutral-primary"
              />
            </button>
            <Link href="/mypage">
              <ProfileIcon
                width={24}
                height={24}
                className="text-icon-neutral-primary"
              />
            </Link>
          </>
        }
      />
      <StockTickerBar
        title="발견"
        logo={false}
        kospi={kospi && { value: kospi.value, changeRate: kospi.changeRate }}
      />
      <div className="flex flex-col gap-4 px-5">
        <SearchInput placeholder="종목 검색" />
        <span className="heading-2-semibold">실시간 차트</span>
        <RankingTypeTabs value={rankingType} onChange={setRankingType} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-28">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }, (_, index) => (
              <RankingItemSkeleton key={index} />
            ))}
          </div>
        ) : ranking.length === 0 ? (
          <EmptyState icon={BasketFlusteredIcon} message="종목 정보가 없어요" />
        ) : (
          <RankingList
            items={ranking}
            hasMore={hasNextPage && !isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
      <BottomTabBar />
    </div>
  );
}
