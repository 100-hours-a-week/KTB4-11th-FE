"use client";

import { useEffect, useState } from "react";
import { HoldingCategoryChips } from "@/features/account/components/HoldingCategoryChips";
import { HoldingStockItem } from "@/features/account/components/HoldingStockItem";
import { HoldingStockItemSkeleton } from "@/features/account/components/HoldingStockItemSkeleton";
import { HoldingsSortDropdown } from "@/features/account/components/HoldingsSortDropdown";
import { useHoldingsQuery } from "@/features/account/hooks/useHoldingsQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import type { HoldingsSort } from "@/features/account/types/holdingStock";
import { toHoldingStock } from "@/features/account/utils/toHoldingStock";
import BasketFlusteredIcon from "@/assets/icons/stockspoon/basket-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { EmptyStateCard } from "@/shared/components/EmptyStateCard";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { trackEvent } from "@/shared/utils/analytics";

const ALL_CATEGORY = "전체";
const PAGE_SIZE = 10;

export function HoldingsContainer() {
  const accountId = useSelectedAccountId();
  const [sort, setSort] = useState<HoldingsSort>("latest_purchase");
  const [category, setCategory] = useState(ALL_CATEGORY);

  const {
    data: holdingsData,
    isError,
    isPending,
    refetch,
  } = useHoldingsQuery(accountId, { sort, order: "desc" });

  const stocks = (holdingsData?.holdings ?? []).map(toHoldingStock);
  const categories = Array.from(new Set(stocks.map((stock) => stock.category)));

  const filteredStocks =
    category === ALL_CATEGORY
      ? stocks
      : stocks.filter((stock) => stock.category === category);

  // 업종 필터가 바뀌면 보여줄 개수도 처음부터 다시 셈
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lastCategory, setLastCategory] = useState(category);
  if (category !== lastCategory) {
    setLastCategory(category);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleStocks = filteredStocks.slice(0, visibleCount);
  const hasMore = visibleCount < filteredStocks.length;
  const sentinelRef = useInfiniteScroll({
    hasMore,
    onLoadMore: () => setVisibleCount((count) => count + PAGE_SIZE),
  });

  useEffect(() => {
    if (isError) {
      trackEvent("error_view", {
        screen: "holdings_list",
        api_name: "holdings",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (!isError && holdingsData && filteredStocks.length === 0) {
      trackEvent("empty_state_view", {
        screen: "holdings_list",
        empty_type:
          category === ALL_CATEGORY ? "no_holdings" : "no_holdings_category",
      });
    }
  }, [isError, holdingsData, filteredStocks.length, category]);

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title="보유 주식"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-3 px-5 pt-2 pb-8">
        {!isError && categories.length > 0 && (
          <HoldingCategoryChips
            categories={categories}
            value={category}
            onChange={(value) => {
              trackEvent("filter_chip_click", {
                screen: "holdings_list",
                filter_value: value,
              });
              setCategory(value);
            }}
          />
        )}

        {!isError && filteredStocks.length > 0 && (
          <div className="flex justify-end">
            <HoldingsSortDropdown value={sort} onChange={setSort} />
          </div>
        )}

        {isError ? (
          <EmptyStateCard>
            <ErrorState
              onRetry={() => {
                trackEvent("retry_click", {
                  screen: "holdings_list",
                  api_name: "holdings",
                });
                refetch();
              }}
            />
          </EmptyStateCard>
        ) : isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }, (_, index) => (
              <HoldingStockItemSkeleton key={index} />
            ))}
          </div>
        ) : filteredStocks.length === 0 ? (
          <EmptyStateCard>
            <EmptyState
              icon={BasketFlusteredIcon}
              message={
                category === ALL_CATEGORY
                  ? "아직 보유한 종목이 없어요"
                  : `${category} 종목이 없어요`
              }
              description={
                category === ALL_CATEGORY
                  ? "매매가 체결되면 보유 종목이 여기 표시돼요"
                  : undefined
              }
            />
          </EmptyStateCard>
        ) : (
          <div className="flex flex-col gap-2">
            {visibleStocks.map((stock) => (
              <HoldingStockItem key={stock.id} {...stock} />
            ))}
            {hasMore && <div ref={sentinelRef} className="h-1" />}
          </div>
        )}
      </div>
    </div>
  );
}
