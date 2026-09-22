"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/account/api/getAccounts";

export function useAccountsQuery() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
}
