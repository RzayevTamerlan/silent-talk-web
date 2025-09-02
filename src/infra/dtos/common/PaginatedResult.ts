export type PaginatedResult<T> = {
  data: T[];
  currentPage: number;
  currentLimit: number;
  total: number;
  totalPages: number;
};
