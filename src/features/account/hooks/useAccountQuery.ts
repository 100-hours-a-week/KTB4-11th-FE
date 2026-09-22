"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccount } from "@/features/account/api/getAccount";

export function useAccountQuery(accountId?: number) {
  return useQuery({
    queryKey: ["account", accountId],
    queryFn: () => getAccount(accountId!),
    enabled: accountId !== undefined,
  });
}
