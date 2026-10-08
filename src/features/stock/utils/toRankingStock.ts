import type {
  RankingApiItem,
  RankingStock,
} from "@/features/stock/types/ranking";

export function toRankingStock(item: RankingApiItem): RankingStock {
  return {
    rank: item.rank,
    stockCode: item.stockCode,
    name: item.stockName,
    sector: item.sectorName,
    price: item.price,
    changeRate: item.changeRate,
    isFavorite: item.isFavorite,
  };
}
