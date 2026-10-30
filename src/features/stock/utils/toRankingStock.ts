import type {
  RankingApiItem,
  RankingStock,
} from "@/features/stock/types/ranking";

// market 랭킹 정보와 백엔드 관심 종목 코드를 결합
export function toRankingStock(
  item: RankingApiItem,
  favoriteCodes?: ReadonlySet<string>,
): RankingStock {
  return {
    rank: item.rank,
    stockCode: item.code,
    name: item.stock_name ?? item.code,
    sector: item.sector_name ?? "",
    price: item.price,
    changeRate: item.change_rate,
    isFavorite: favoriteCodes?.has(item.code),
  };
}
