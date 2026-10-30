"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getOrders,
  type GetOrdersParams,
} from "@/features/stock/api/getOrders";

export function useOrdersQuery(accountId?: number, params?: GetOrdersParams) {
  return useQuery({
    queryKey: ["orders", accountId, params],
    queryFn: () => getOrders(accountId!, params),
    enabled: accountId !== undefined,
    placeholderData: keepPreviousData,
  });
}
