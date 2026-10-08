export const RANKING_TYPES = [
  "거래대금",
  "거래량",
  "급상승",
  "급하락",
  "인기",
] as const;

export type RankingType = (typeof RANKING_TYPES)[number];

export type RankingApiType =
  "TRADING_VALUE" | "VOLUME" | "RISE" | "FALL" | "POPULAR";

export const RANKING_TYPE_TO_API_TYPE: Record<RankingType, RankingApiType> = {
  거래대금: "TRADING_VALUE",
  거래량: "VOLUME",
  급상승: "RISE",
  급하락: "FALL",
  인기: "POPULAR",
};

export interface RankingStock {
  rank?: number;
  stockCode: string;
  name: string;
  sector: string;
  price: number;
  changeRate: number;
  isFavorite: boolean;
}

export interface RankingApiItem {
  rank: number;
  stock_code: string;
  stock_name: string;
  sector_name: string;
  logo_url: string | null;
  price: number;
  change_rate: number;
  is_favorite: boolean;
}

export interface RankingApiResponse {
  ranking_type: RankingApiType;
  updated_at: string;
  page: number;
  size: number;
  total_elements: number;
  total_pages: number;
  has_previous: boolean;
  has_next: boolean;
  items: RankingApiItem[];
}
