"use client";

import { useQuery } from "@tanstack/react-query";
import { getWatchlist } from "@/features/stock/api/getWatchlist";

export function useWatchlistQuery() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: getWatchlist,
  });
}
