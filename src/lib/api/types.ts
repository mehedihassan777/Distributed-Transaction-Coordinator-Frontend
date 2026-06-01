export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SearchParams {
  search?: string;
}

export type TableQueryParams = SortParams & PaginationParams & SearchParams;
