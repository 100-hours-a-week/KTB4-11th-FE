export const RANKING_TYPES = [
  "거래대금",
  "거래량",
  "급상승",
  "급하락",
  "인기",
] as const;
export type RankingType = (typeof RANKING_TYPES)[number];
export type RankingApiType =
  "trade_value" | "volume" | "gainers" | "losers" | "popular";
export const RANKING_TYPE_TO_API_TYPE: Record<RankingType, RankingApiType> = {
  거래대금: "trade_value",
  거래량: "volume",
  급상승: "gainers",
  급하락: "losers",
  인기: "popular",
};
export const RANKING_BATCH_SIZE = 20;
export const RANKING_MAX_LIMIT = 100;

export interface RankingStock {
  rank?: number;
  stockCode: string;
  name: string;
  sector: string;
  price: number | null;
  changeRate: number | null;
  isFavorite?: boolean;
}

export interface RankingApiItem {
  rank: number;
  code: string;
  score: number;
  stock_name: string | null;
  sector_name: string | null;
  price: number | null;
  change_rate: number | null;
}

export interface RankingApiResponse {
  as_of: string | null;
  updated_at: string | null;
  items: RankingApiItem[];
}
