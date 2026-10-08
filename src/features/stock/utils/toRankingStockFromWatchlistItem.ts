import type { RankingStock } from "@/features/stock/types/ranking";
import type { WatchlistItem } from "@/features/stock/types/watchlist";

export function toRankingStockFromWatchlistItem(
  item: WatchlistItem,
): RankingStock {
  return {
    stockCode: item.stock_code,
    name: item.stock_name,
    sector: item.sector,
    price: item.current_price,
    changeRate: item.price_change_percent,
    isFavorite: true,
  };
}
