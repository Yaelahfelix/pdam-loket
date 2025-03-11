export interface PaginationResultType {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
