import { apiFetch, buildQueryString, type PaginatedResponse } from "@/lib/api";
import type { Product } from "./types";

export interface ProductQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
}

export async function fetchProducts(
  params: ProductQueryParams,
  serverToken?: string,
): Promise<PaginatedResponse<Product>> {
  const qs = buildQueryString({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
  });
  return apiFetch<PaginatedResponse<Product>>(
    `/products${qs}`,
    serverToken ? { serverSide: true, serverToken } : undefined,
  );
}
