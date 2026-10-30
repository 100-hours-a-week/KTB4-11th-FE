"use client";

// 검색 API가 없어 거래대금 상위 종목 + 관심 종목을 검색 대상 풀로 사용
import { useQuery } from "@tanstack/react-query";
import { getRanking } from "@/features/stock/api/getRanking";
import {
  RANKING_MAX_LIMIT,
  type RankingStock,
} from "@/features/stock/types/ranking";
import { useMarketPrices } from "@/features/stock/hooks/useMarketPrices";
import { useWatchlistQuery } from "@/features/stock/hooks/useWatchlistQuery";
import { toRankingStock } from "@/features/stock/utils/toRankingStock";
import { toRankingStockFromWatchlistItem } from "@/features/stock/utils/toRankingStockFromWatchlistItem";

export function useSearchableStocks() {
  const rankingQuery = useQuery({
    queryKey: ["ranking", "trade_value", RANKING_MAX_LIMIT],
    queryFn: ({ signal }) =>
      getRanking({ type: "trade_value", limit: RANKING_MAX_LIMIT, signal }),
  });
  const watchlistQuery = useWatchlistQuery();
  const watchlistCodes = (watchlistQuery.data?.watchlists ?? []).map(
    (item) => item.stock_code,
  );
  const { prices: watchlistPrices } = useMarketPrices(watchlistCodes);

  const ranking = (rankingQuery.data?.items ?? []).map((item) =>
    toRankingStock(item),
  );
  const watchlistStocks = (watchlistQuery.data?.watchlists ?? []).map((item) =>
    toRankingStockFromWatchlistItem(item, watchlistPrices[item.stock_code]),
  );

  const byCode = new Map<string, RankingStock>();
  for (const stock of [...ranking, ...watchlistStocks]) {
    if (!byCode.has(stock.stockCode)) byCode.set(stock.stockCode, stock);
  }

  return {
    stocks: Array.from(byCode.values()),
    isPending: rankingQuery.isPending,
    isError: rankingQuery.isError,
  };
}
