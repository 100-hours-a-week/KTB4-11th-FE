"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccountList } from "@/features/account/api/getAccountList";

export function useAccountListQuery() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccountList,
  });
}
