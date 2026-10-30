import { apiClient } from "@/shared/lib/axios";
import type { WatchlistResponse } from "@/features/stock/types/watchlist";

export async function getWatchlist() {
  const { data: watchlistResponse } = await apiClient.get<WatchlistResponse>(
    "/api/v2/users/me/watchlist",
  );

  return watchlistResponse;
}
