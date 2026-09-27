"use client";

import { useQuery } from "@tanstack/react-query";
import { getHoldings } from "@/features/account/api/getHoldings";
import type { HoldingsQueryParams } from "@/features/account/types/holdingStock";

export function useHoldingsQuery(
  accountId?: number,
  params?: HoldingsQueryParams,
) {
  return useQuery({
    queryKey: ["holdings", accountId, params],
    queryFn: () => getHoldings(accountId!, params),
    enabled: accountId !== undefined,
  });
}
