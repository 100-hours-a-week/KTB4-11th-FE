"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccountDetail } from "@/features/account/api/getAccountDetail";

export function useAccountDetailQuery(accountId?: number) {
  return useQuery({
    queryKey: ["account", accountId],
    queryFn: () => getAccountDetail(accountId!),
    enabled: accountId !== undefined,
  });
}
