"use client";

import { useQuery } from "@tanstack/react-query";
import { getKospiIndex } from "@/features/stock/api/getKospiIndex";

export function useKospiIndexQuery() {
  return useQuery({
    queryKey: ["kospi-index"],
    queryFn: getKospiIndex,
    refetchInterval: 10_000,
  });
}
