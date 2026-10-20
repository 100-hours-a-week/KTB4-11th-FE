export interface Pagination {
  page: number;
  limit: number;
  total_elements: number;
  total_pages: number;
  has_next: boolean;
}
