"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/stock/api/getOrders";
import type { OrderSide } from "@/features/ai/types/aiTrade";

const ORDERS_PAGE_SIZE = 10;

export function useOrdersInfiniteQuery(
  accountId?: number,
  orderSide?: OrderSide,
) {
  return useInfiniteQuery({
    queryKey: ["orders", "infinite", accountId, orderSide],
    queryFn: ({ pageParam }) =>
      // 매매 내역 화면은 체결된 거래만 보여주므로 executed로 고정
      getOrders(accountId!, {
        page: pageParam,
        limit: ORDERS_PAGE_SIZE,
        orderSide,
        orderStatus: "executed",
      }),
    // 주문 내역 API는 page가 0부터 시작
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    enabled: accountId !== undefined,
    placeholderData: keepPreviousData,
  });
}
