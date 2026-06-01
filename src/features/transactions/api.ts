import { apiFetch, buildQueryString, type PaginatedResponse } from "@/lib/api";
import type { Transaction } from "./types";

export interface TransactionQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
}

export async function fetchTransactions(
  params: TransactionQueryParams,
  serverToken?: string,
): Promise<PaginatedResponse<Transaction>> {
  const qs = buildQueryString({
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
  });
  return apiFetch<PaginatedResponse<Transaction>>(
    `/transactions${qs}`,
    serverToken
      ? { serverSide: true, serverToken }
      : undefined,
  );
}
