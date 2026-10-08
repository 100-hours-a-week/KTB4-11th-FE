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

// 응답 필드는 camelCase (다른 API와 컨벤션이 다름, BE 확인 필요)
export interface RankingApiItem {
  rank: number;
  stockCode: string;
  stockName: string;
  sectorName: string;
  logoUrl: string | null;
  price: number;
  changeRate: number;
  priceBasis: string;
  priceUpdatedAt: string;
  isFavorite: boolean;
}

export interface RankingApiResponse {
  rankingType: RankingApiType;
  rankUpdatedAt: string;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: RankingApiItem[];
}
