import type { RankingStock } from "@/features/stock/types/ranking";
import type { StockSearchItem } from "@/features/stock/types/stockSearch";
import type { MarketPriceTick } from "@/features/stock/types/market";

export function toRankingStockFromSearchItem(
  item: StockSearchItem,
  price?: MarketPriceTick,
): RankingStock {
  return {
    stockCode: item.stock_code,
    name: item.stock_name,
    sector: item.sector,
    price:
      price && Number.isFinite(price.price) && price.price > 0
        ? price.price
        : null,
    changeRate: price && Number.isFinite(price.rate) ? price.rate : null,
  };
}
