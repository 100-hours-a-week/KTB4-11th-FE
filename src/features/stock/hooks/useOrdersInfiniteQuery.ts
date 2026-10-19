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
      getOrders(accountId!, {
        page: pageParam,
        limit: ORDERS_PAGE_SIZE,
        orderSide,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    enabled: accountId !== undefined,
    placeholderData: keepPreviousData,
  });
}
