"use client";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/shared/utils/cn";
import { useRouter } from "next/navigation";
import HeartFilledIcon from "@/assets/icons/nav/filled/heart.svg";
import HeartOutlineIcon from "@/assets/icons/nav/outline/heart.svg";
import { useOrdersInfiniteQuery } from "@/features/stock/hooks/useOrdersInfiniteQuery";
import { useSelectedAccountId } from "@/features/account/hooks/useSelectedAccountId";
import { useStockChart } from "@/features/stock/hooks/useStockChart";
import { StockChartSelectionSummary } from "@/features/stock/components/chart/StockChartSelectionSummary";
import { StockChart } from "@/features/stock/components/chart/StockChart";
import { StockDetailTabs } from "@/features/stock/components/StockDetailTabs";
import { StockHoldingSummary } from "@/features/stock/components/StockHoldingSummary";
import { StockOrderBook } from "@/features/stock/components/StockOrderBook";
import { StockOrderBookWaitingBar } from "@/features/stock/components/StockOrderBookWaitingBar";
import { StockOrderHistoryList } from "@/features/stock/components/StockOrderHistoryList";
import { StockPendingOrderList } from "@/features/stock/components/StockPendingOrderList";
import { StockPriceSummary } from "@/features/stock/components/StockPriceSummary";
import { StockTradeButtons } from "@/features/stock/components/StockTradeButtons";
import { useCancelOrderMutation } from "@/features/stock/hooks/useCancelOrderMutation";
import { useMarketOrderBook } from "@/features/stock/hooks/useMarketOrderBook";
import { useMarketPrice } from "@/features/stock/hooks/useMarketPrice";
import { useStockHoldingQuery } from "@/features/stock/hooks/useStockHoldingQuery";
import { useStockHoldingValuationQuery } from "@/features/stock/hooks/useStockHoldingValuationQuery";
import { useStockInfoQuery } from "@/features/stock/hooks/useStockInfoQuery";
import { useToggleWatchlistMutation } from "@/features/stock/hooks/useToggleWatchlistMutation";
import { useWatchlistQuery } from "@/features/stock/hooks/useWatchlistQuery";
import type { StockDetailTab } from "@/features/stock/types/stockDetail";
import { useStockDetailTab } from "@/features/stock/hooks/useStockDetailTab";
import { isRegularMarketHours } from "@/features/stock/utils/marketHours";
import { toOrderBook } from "@/features/stock/utils/toOrderBook";
import { toPendingOrder } from "@/features/stock/utils/toPendingOrder";
import { toStockTrade } from "@/features/stock/utils/toStockTrade";
import { Header, HeaderBackButton } from "@/shared/components/Header";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";

interface StockDetailContainerProps {
  code: string;
  initialTab?: StockDetailTab;
}

export function StockDetailContainer({
  code,
  initialTab = "차트",
}: StockDetailContainerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: stockInfo } = useStockInfoQuery(code);
  const { price: marketPrice, isPending: isMarketPricePending } =
    useMarketPrice(code);
  const name = stockInfo?.stock_name ?? code;
  const price = marketPrice?.price ?? 0;
  const changeAmount = marketPrice?.change ?? 0;
  const changeRate = marketPrice?.rate ?? 0;

  const chart = useStockChart(
    code,
    price,
    changeAmount,
    marketPrice?.timestamp,
  );

  const accountId = useSelectedAccountId();
  const { data: holdingData } = useStockHoldingQuery(accountId, code);
  const hasHolding = holdingData?.is_held ?? false;

  const {
    data: pendingOrdersData,
    hasNextPage: hasMorePendingOrders,
    isFetchingNextPage: isFetchingNextPendingOrders,
    fetchNextPage: fetchNextPendingOrdersPage,
  } = useOrdersInfiniteQuery(accountId, {
    stockCode: code,
    orderStatus: "pending",
  });
  const {
    data: orderHistoryData,
    hasNextPage: hasMoreOrderHistory,
    isFetchingNextPage: isFetchingNextOrderHistory,
    fetchNextPage: fetchNextOrderHistoryPage,
  } = useOrdersInfiniteQuery(accountId, {
    stockCode: code,
    orderStatus: "executed",
  });
  const pendingOrders = (pendingOrdersData?.pages ?? [])
    .flatMap((page) => page.orders)
    .filter((order) => order.order_source === "USER")
    .map(toPendingOrder);
  const orderHistory = (orderHistoryData?.pages ?? [])
    .flatMap((page) => page.orders)
    .filter((order) => order.order_source === "USER")
    .map(toStockTrade);

  const pendingOrdersSentinelRef = useInfiniteScroll({
    hasMore: hasMorePendingOrders && !isFetchingNextPendingOrders,
    onLoadMore: () => fetchNextPendingOrdersPage(),
  });
  const orderHistorySentinelRef = useInfiniteScroll({
    hasMore: hasMoreOrderHistory && !isFetchingNextOrderHistory,
    onLoadMore: () => fetchNextOrderHistoryPage(),
  });

  const cancelOrderMutation = useCancelOrderMutation(accountId);

  const { data: watchlistData } = useWatchlistQuery();
  const isFavorite =
    watchlistData?.watchlists.some((item) => item.stock_code === code) ?? false;
  const toggleWatchlistMutation = useToggleWatchlistMutation();

  const { tab, tabs, selectTab } = useStockDetailTab(
    initialTab,
    holdingData?.is_held,
  );
  const { data: holding } = useStockHoldingValuationQuery(
    accountId,
    code,
    tab === "내 주식",
  );

  const { orderBook: marketOrderBook, isLoading: isOrderBookLoading } =
    useMarketOrderBook(tab === "호가" ? code : undefined);
  const orderBook =
    marketOrderBook &&
    toOrderBook(
      marketOrderBook,
      price,
      changeRate,
      isRegularMarketHours(),
      marketPrice,
    );

  const HeartIcon = isFavorite ? HeartFilledIcon : HeartOutlineIcon;

  return (
    <div className="bg-page-gradient pt-screen-top flex h-full flex-col">
      <Header
        className="px-5 py-3"
        left={<HeaderBackButton />}
        right={
          <button
            type="button"
            onClick={() => {
              toggleWatchlistMutation.mutate(
                { stockCode: code, isFavorite },
                {
                  onError: () =>
                    toast.error(
                      isFavorite
                        ? "관심 종목 취소에 실패했어요"
                        : "관심 종목 등록에 실패했어요",
                    ),
                },
              );
            }}
            aria-label={isFavorite ? "관심 종목 해제" : "관심 종목 등록"}
          >
            <HeartIcon
              width={24}
              height={24}
              className={
                isFavorite ? "text-icon-accent" : "text-icon-neutral-secondary"
              }
            />
          </button>
        }
      />

      <div className="relative">
        {tab === "차트" && chart.detailed && chart.selection && (
          <div className="absolute inset-x-3 top-0 z-20">
            <StockChartSelectionSummary
              granularity={chart.granularity}
              name={name}
              selection={chart.selection}
              currentPrice={price}
              previousClose={price - changeAmount}
            />
          </div>
        )}
        <StockPriceSummary
          name={name}
          price={price}
          isPending={isMarketPricePending}
          changeAmount={
            tab === "차트" && !chart.detailed && chart.bars.length
              ? chart.changeAmount
              : changeAmount
          }
          changeRate={
            tab === "차트" && !chart.detailed && chart.bars.length
              ? chart.changeRate
              : changeRate
          }
          comparisonLabel={
            tab === "차트" && !chart.detailed
              ? chart.comparisonLabel
              : "어제보다"
          }
        />
      </div>
      <div className="mt-4">
        <StockDetailTabs tabs={tabs} value={tab} onChange={selectTab} />
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto",
          tab !== "호가" && "pb-4",
        )}
      >
        {tab === "차트" && <StockChart model={chart} />}
        {tab === "호가" &&
          (orderBook ? (
            <StockOrderBook orderBook={orderBook} />
          ) : (
            <div className="flex h-70 items-center justify-center">
              <span className="caption-1-regular text-text-neutral-tertiary">
                {isOrderBookLoading
                  ? "호가를 불러오는 중이에요"
                  : "장이 열리면 호가를 확인할 수 있어요"}
              </span>
            </div>
          ))}
        {tab === "내 주식" && hasHolding && holding && (
          <div className="flex flex-col gap-4 px-5 pt-4">
            <StockHoldingSummary holding={holding} />
            <StockPendingOrderList
              orders={pendingOrders}
              onCancel={(orderId) => {
                cancelOrderMutation.mutate(orderId, {
                  onSuccess: () => toast.success("주문을 취소했어요"),
                  onError: () =>
                    toast.error(
                      "주문을 취소하지 못했어요. 다시 시도해 주세요.",
                    ),
                });
              }}
            />
            {hasMorePendingOrders && (
              <div ref={pendingOrdersSentinelRef} className="h-1" />
            )}
            <StockOrderHistoryList items={orderHistory} />
            {hasMoreOrderHistory && (
              <div ref={orderHistorySentinelRef} className="h-1" />
            )}
          </div>
        )}
      </div>

      <div className="relative">
        {tab !== "호가" && (
          <div
            className="pointer-events-none absolute inset-x-0 -top-9 h-9"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, var(--color-bg-layer-basement) 100%)",
            }}
          />
        )}
        {tab === "호가" && orderBook && (
          <StockOrderBookWaitingBar orderBook={orderBook} />
        )}
        <StockTradeButtons
          showSell={hasHolding}
          onBuyClick={() => {
            // 구매 화면이 이전 REST 캐시 대신 진입 순간의 시세로 초기화
            if (marketPrice)
              queryClient.setQueryData(["marketPrices", code], [marketPrice]);
            router.push(`/stock/${code}/buy`);
          }}
          onSellClick={() => router.push(`/stock/${code}/sell`)}
        />
      </div>
    </div>
  );
}
