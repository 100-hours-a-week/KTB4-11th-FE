export interface WatchlistItem {
  stock_code: string;
  stock_name: string;
  sector: string;
  current_price: number;
  price_change_percent: number;
}

export interface WatchlistResponse {
  message: string;
  watchlists: WatchlistItem[];
}
