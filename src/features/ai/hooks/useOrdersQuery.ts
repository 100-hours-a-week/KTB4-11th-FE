"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/ai/api/getOrders";

export function useOrdersQuery(accountId?: number) {
  return useQuery({
    queryKey: ["orders", accountId],
    queryFn: () => getOrders(accountId!),
    enabled: accountId !== undefined,
  });
}
