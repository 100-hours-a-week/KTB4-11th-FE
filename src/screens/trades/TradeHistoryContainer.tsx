"use client";

import { useEffect, useRef, useState } from "react";
import { useOrdersInfiniteQuery } from "@/features/stock/hooks/useOrdersInfiniteQuery";
import type { OrderSide } from "@/features/ai/types/aiTrade";
import {
  TradeFilterChips,
  type TradeFilterValue,
} from "@/features/stock/components/trade/TradeFilterChips";
import { useAccountListQuery } from "@/features/account/hooks/useAccountListQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { toStockTrade } from "@/features/stock/utils/toStockTrade";
import CartFlusteredIcon from "@/assets/icons/stockspoon/cart-flustered.svg";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { TradeCard } from "@/shared/components/TradeCard";
import { TradeCardSkeleton } from "@/shared/components/TradeCardSkeleton";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { trackEvent } from "@/shared/utils/analytics";

const FILTER_TO_ORDER_SIDE: Record<TradeFilterValue, OrderSide | undefined> = {
  전체: undefined,
  매수: "buy",
  매도: "sell",
};

export function TradeHistoryContainer() {
  const accountId = useSelectedAccountId();
  const [filter, setFilter] = useState<TradeFilterValue>("전체");

  const {
    data,
    isError,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useOrdersInfiniteQuery(accountId, FILTER_TO_ORDER_SIDE[filter]);
  const { data: accounts } = useAccountListQuery();

  const trades = (data?.pages ?? []).flatMap((page) =>
    page.orders.map(toStockTrade),
  );
  const sentinelRef = useInfiniteScroll({
    hasMore: hasNextPage && !isFetchingNextPage,
    onLoadMore: () => fetchNextPage(),
  });

  const hasTrackedView = useRef(false);
  useEffect(() => {
    if (data && !hasTrackedView.current) {
      hasTrackedView.current = true;
      trackEvent("trade_list_view", {
        trade_count: trades.length,
        account_count: accounts?.length ?? 0,
      });
    }
  }, [data, trades.length, accounts?.length]);

  useEffect(() => {
    if (isError) {
      trackEvent("error_view", {
        screen: "trade_history",
        api_name: "orders",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (!isError && data && filter === "전체" && trades.length === 0) {
      trackEvent("empty_state_view", {
        screen: "trade_history",
        empty_type: "no_trades",
      });
    }
  }, [isError, data, filter, trades.length]);

  return (
    <div className="pt-screen-top flex h-full flex-col">
      <Header
        title="매매 내역"
        className="px-5 py-3"
        left={<HeaderBackButton />}
      />

      <div className="flex flex-1 flex-col gap-4 px-5 pt-4 pb-8">
        <TradeFilterChips value={filter} onChange={setFilter} />

        {isError ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <ErrorState
              onRetry={() => {
                trackEvent("retry_click", {
                  screen: "trade_history",
                  api_name: "orders",
                });
                refetch();
              }}
            />
          </div>
        ) : isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <TradeCardSkeleton key={index} />
            ))}
          </div>
        ) : trades.length === 0 ? (
          <div className="bg-bg-layer-default flex flex-1 flex-col items-center rounded-2xl pt-32">
            <EmptyState
              icon={CartFlusteredIcon}
              message={
                filter === "전체"
                  ? "매매 내역이 없어요"
                  : `${filter} 내역이 없어요`
              }
              description="매매를 진행하면 여기에 표시돼요"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {trades.map((trade) => (
              <TradeCard key={trade.tradeId} {...trade} />
            ))}
            {hasNextPage && <div ref={sentinelRef} className="h-1" />}
          </div>
        )}
      </div>
    </div>
  );
}
