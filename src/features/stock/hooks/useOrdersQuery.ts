"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/stock/api/getOrders";

interface UseOrdersQueryParams {
  limit?: number;
}

export function useOrdersQuery(
  accountId?: number,
  params?: UseOrdersQueryParams,
) {
  return useQuery({
    queryKey: ["orders", accountId, params],
    queryFn: () => getOrders(accountId!, params),
    enabled: accountId !== undefined,
    placeholderData: keepPreviousData,
  });
}
