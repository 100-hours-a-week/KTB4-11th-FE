"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccountList } from "@/features/account/api/getAccountList";

interface UseAccountListQueryOptions {
  skipAuthRedirect?: boolean;
  retry?: boolean;
}

export function useAccountListQuery(options?: UseAccountListQueryOptions) {
  const { skipAuthRedirect, retry } = options ?? {};

  return useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      getAccountList(skipAuthRedirect ? { skipAuthRedirect: true } : undefined),
    ...(retry !== undefined && { retry }),
  });
}
