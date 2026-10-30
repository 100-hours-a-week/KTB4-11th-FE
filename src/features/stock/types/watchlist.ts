export interface WatchlistItem {
  stock_code: string;
  stock_name: string;
  sector: string;
}

export interface WatchlistResponse {
  message: string;
  watchlists: WatchlistItem[];
}
