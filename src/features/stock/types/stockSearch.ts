export interface StockSearchItem {
  stock_code: string;
  stock_name: string;
  market: string;
  sector: string;
}

export interface StockSearchResponse {
  keyword: string;
  total_count: number;
  stocks: StockSearchItem[];
}
