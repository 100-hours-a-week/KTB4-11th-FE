export interface SearchHistoryItem {
  search_id: number;
  keyword: string;
  created_at: string;
}

export interface SearchHistoryResponse {
  search_history: SearchHistoryItem[];
}

export interface CreateSearchHistoryResponse {
  search_id: number;
}
