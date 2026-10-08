"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { RankingItem } from "@/features/stock/components/RankingItem";
import { RankingItemSkeleton } from "@/features/stock/components/RankingItemSkeleton";
import { useToggleFavoriteMutation } from "@/features/stock/hooks/useToggleFavoriteMutation";
import { useWatchlistQuery } from "@/features/stock/hooks/useWatchlistQuery";
import { useKospiIndexQuery } from "@/features/stock/hooks/useKospiIndexQuery";
import { toRankingStockFromWatchlistItem } from "@/features/stock/utils/toRankingStockFromWatchlistItem";
import HeartSadIcon from "@/assets/icons/stockspoon/heart-sad.svg";
import SearchIcon from "@/assets/icons/fill/search.svg";
import ProfileIcon from "@/assets/icons/fill/profile.svg";
import { BottomTabBar } from "@/shared/components/BottomTabBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { FilterChips } from "@/shared/components/FilterChips";
import { Header } from "@/shared/components/Header";
import { StockTickerBar } from "@/shared/components/StockTickerBar";
import { trackEvent } from "@/shared/utils/analytics";

const ALL_SECTOR = "전체";

export function FavoritesContainer() {
  const router = useRouter();
  const { data: kospi } = useKospiIndexQuery();
  const [sector, setSector] = useState(ALL_SECTOR);

  const { data, isPending, isError, refetch } = useWatchlistQuery();
  const toggleFavorite = useToggleFavoriteMutation();

  const stocks = (data?.watchlists ?? []).map(toRankingStockFromWatchlistItem);
  const sectors = Array.from(new Set(stocks.map((stock) => stock.sector)));
  const filteredStocks =
    sector === ALL_SECTOR
      ? stocks
      : stocks.filter((stock) => stock.sector === sector);

  function handleToggleFavorite(stockCode: string) {
    const target = stocks.find((item) => item.stockCode === stockCode);
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
        title="관심"
        logo={false}
        kospi={kospi && { value: kospi.value, changeRate: kospi.changeRate }}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-28">
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isPending ? (
          <div className="flex flex-col gap-2 pt-4">
            {Array.from({ length: 6 }, (_, index) => (
              <RankingItemSkeleton key={index} />
            ))}
          </div>
        ) : stocks.length === 0 ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <EmptyState
              icon={HeartSadIcon}
              message="관심 목록이 비어있어요"
              description="마음에 드는 종목에 하트를 눌러보세요"
              actionLabel="종목 찾아보기"
              onAction={() => router.push("/discover")}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-4">
            <FilterChips
              options={[ALL_SECTOR, ...sectors]}
              value={sector}
              onChange={setSector}
              scrollable
            />
            <div className="flex flex-col gap-2">
              {filteredStocks.map((stock) => (
                <RankingItem
                  key={stock.stockCode}
                  {...stock}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <BottomTabBar />
    </div>
  );
}
