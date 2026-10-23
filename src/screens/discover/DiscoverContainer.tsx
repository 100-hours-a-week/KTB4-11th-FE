"use client";

import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import { RankingList } from "@/features/stock/components/RankingList";
import { RankingItemSkeleton } from "@/features/stock/components/RankingItemSkeleton";
import { RankingTypeTabs } from "@/features/stock/components/RankingTypeTabs";
import { SearchInput } from "@/features/stock/components/SearchInput";
import { useRankingQuery } from "@/features/stock/hooks/useRankingQuery";
import { useWatchlistQuery } from "@/features/stock/hooks/useWatchlistQuery";
import { useToggleFavoriteMutation } from "@/features/stock/hooks/useToggleFavoriteMutation";
import { useRankingTab } from "@/features/stock/hooks/useRankingTab";
import { toRankingStock } from "@/features/stock/utils/toRankingStock";
import { useKospiIndexQuery } from "@/features/stock/hooks/useKospiIndexQuery";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header } from "@/shared/components/Header";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { trackEvent } from "@/shared/utils/analytics";

export function DiscoverContainer() {
  const { data: kospi } = useKospiIndexQuery();
  const { rankingType, setRankingType } = useRankingTab();

  const { data, isPending, isError, refetch, loadMore, hasMore, isFetching } =
    useRankingQuery(rankingType);
  const watchlist = useWatchlistQuery();
  const toggleFavorite = useToggleFavoriteMutation();
  const favoriteCodes = useMemo(
    () =>
      watchlist.data
        ? new Set(watchlist.data.watchlists.map((item) => item.stock_code))
        : undefined,
    [watchlist.data],
  );
  const ranking = (data?.items ?? []).map((item) =>
    toRankingStock(item, favoriteCodes),
  );

  function handleToggleFavorite(stockCode: string) {
    const target = ranking.find((item) => item.stockCode === stockCode);
    if (!target || toggleFavorite.isPending) return;
    if (target.isFavorite === undefined) {
      toast.error("관심 종목 등록에 실패했어요");
      return;
    }

    toggleFavorite.mutate(
      {
        stockCode,
        isFavorite: target.isFavorite,
        stock: {
          stock_code: stockCode,
          stock_name: target.name,
          sector: target.sector,
        },
      },
      { onError: () => toast.error("관심 종목 등록에 실패했어요") },
    );
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
                toast.info("검색 기능은 v3에서 이용할 수 있어요");
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
        kospi={kospi && { value: kospi.value, changeRate: kospi.rate }}
      />
      <div className="flex flex-col gap-4 px-5">
        <SearchInput
          placeholder="종목 검색"
          onFocus={(event) => {
            trackEvent("unsupported_feature_click", { feature_name: "search" });
            toast.info("검색 기능은 v3에서 이용할 수 있어요");
            event.currentTarget.blur();
          }}
        />
        <span className="heading-2-semibold">실시간 차트</span>
        <RankingTypeTabs value={rankingType} onChange={setRankingType} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-4 pb-28">
        {isError && !data ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 8 }, (_, index) => (
              <RankingItemSkeleton key={index} />
            ))}
          </div>
        ) : ranking.length === 0 ? (
          <EmptyStateCard>
            <EmptyState
              icon={BasketFlusteredIcon}
              message="랭킹 정보가 없어요"
              description="잠시 후 다시 확인해 주세요"
            />
          </EmptyStateCard>
        ) : (
          <>
            {isError && (
              <button
                type="button"
                className="caption-1-regular text-text-neutral-secondary mb-2"
                onClick={() => void refetch()}
              >
                목록을 갱신하지 못했어요. 다시 시도
              </button>
            )}
            <RankingList
              items={ranking}
              hasMore={hasMore && !isFetching && !isError}
              onLoadMore={loadMore}
              favoriteDisabled={toggleFavorite.isPending}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}
      </div>
      <BottomTabBar />
    </div>
  );
}
