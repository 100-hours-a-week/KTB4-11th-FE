export const RANKING_TYPES = [
  "거래대금",
  "거래량",
  "급상승",
  "급하락",
  "인기",
] as const;

export type RankingType = (typeof RANKING_TYPES)[number];

export interface RankingStock {
  rank: number;
  stockCode: string;
  name: string;
  sector: string;
  price: number;
  changeRate: number;
  isFavorite: boolean;
}
