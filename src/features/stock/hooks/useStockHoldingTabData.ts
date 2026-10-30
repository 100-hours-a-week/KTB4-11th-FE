"use client";

import { toast } from "sonner";
import { useStockHoldingQuery } from "@/features/stock/hooks/useStockHoldingQuery";
import { useOrdersInfiniteQuery } from "@/features/stock/hooks/useOrdersInfiniteQuery";
import { useCancelOrderMutation } from "@/features/stock/hooks/useCancelOrderMutation";
import { toPendingOrder } from "@/features/stock/utils/toPendingOrder";
import { toStockTrade } from "@/features/stock/utils/toStockTrade";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { trackEvent } from "@/shared/utils/analytics";

// 내 주식 탭 노출 판단과 주문 조회·변환·취소를 관리한다.
export function useStockHoldingTabData(
  accountId: number | undefined,
  code: string,
) {
  const { data: holdingData, isFetching: isFetchingHolding } =
    useStockHoldingQuery(accountId, code);
  const hasHolding = holdingData?.is_held ?? false;

  const {
    data: pendingOrdersData,
    isFetching: isFetchingPendingOrders,
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

  // 이전 미보유 캐시가 남아 있어도 재조회 중에는 내 주식 이동 요청을 유지
  const hasStockActivity =
    hasHolding || pendingOrders.length > 0
      ? true
      : isFetchingHolding ||
          isFetchingPendingOrders ||
          !holdingData ||
          !pendingOrdersData
        ? undefined
        : false;

  function cancelOrder(orderId: number) {
    cancelOrderMutation.mutate(orderId, {
      onSuccess: () => {
        trackEvent("order_cancel", { stock_code: code });
        toast.success("주문을 취소했어요");
      },
      onError: () =>
        toast.error("주문을 취소하지 못했어요. 다시 시도해 주세요."),
    });
  }
  return {
    hasHolding,
    hasStockActivity,
    pendingOrders,
    orderHistory,
    hasMorePendingOrders,
    hasMoreOrderHistory,
    pendingOrdersSentinelRef,
    orderHistorySentinelRef,
    cancelOrder,
  };
}
