import type {
  RankingApiItem,
  RankingStock,
} from "@/features/stock/types/ranking";

export function toRankingStock(item: RankingApiItem): RankingStock {
  return {
    rank: item.rank,
    stockCode: item.stock_code,
    name: item.stock_name,
    sector: item.sector_name,
    price: item.price,
    changeRate: item.change_rate,
    isFavorite: item.is_favorite,
  };
}
