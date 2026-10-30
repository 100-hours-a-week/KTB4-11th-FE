"use client";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import {
  getOrders,
  type GetOrdersParams,
} from "@/features/stock/api/getOrders";

const ORDERS_PAGE_SIZE = 10;

type UseOrdersInfiniteQueryParams = Omit<GetOrdersParams, "page" | "limit">;

export function useOrdersInfiniteQuery(
  accountId?: number,
  params?: UseOrdersInfiniteQueryParams,
) {
  return useInfiniteQuery({
    queryKey: ["orders", "infinite", accountId, params],
    queryFn: ({ pageParam }) =>
      getOrders(accountId!, {
        ...params,
        page: pageParam,
        limit: ORDERS_PAGE_SIZE,
      }),
    // 주문 내역 API는 page가 0부터 시작
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    enabled: accountId !== undefined,
    placeholderData: keepPreviousData,
  });
}
