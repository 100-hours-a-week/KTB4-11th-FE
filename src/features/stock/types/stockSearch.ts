export interface StockSearchItem {
  code: string;
  name: string;
  sector?: string;
}

export type StockSearchResponse = StockSearchItem[];
