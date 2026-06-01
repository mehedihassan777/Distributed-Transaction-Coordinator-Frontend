"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api/client";
import type { PaginatedResponse, TableQueryParams } from "@/lib/api/types";
import type { Transaction } from "../types";

interface UseTransactionsState {
  data: Transaction[];
  total: number;
  isLoading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  search: string;
}

const DEFAULT_STATE: UseTransactionsState = {
  data: [],
  total: 0,
  isLoading: true,
  error: null,
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
  search: "",
};

/**
 * Encapsulates all server-side query state for the transactions list.
 * The DataTable component calls `updateQuery` to trigger a new fetch.
 */
export function useTransactions() {
  const [state, setState] = useState<UseTransactionsState>(DEFAULT_STATE);

  const fetchTransactions = useCallback(async (params: UseTransactionsState) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    const query = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      ...(params.search ? { search: params.search } : {}),
    });

    try {
      const result = await api.get<PaginatedResponse<Transaction>>(
        `/transactions?${query.toString()}`
      );
      setState((s) => ({
        ...s,
        data: result.data,
        total: result.total,
        isLoading: false,
      }));
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load transactions";
      setState((s) => ({ ...s, isLoading: false, error: message }));
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQuery = useCallback(
    (params: Partial<TableQueryParams>) => {
      setState((prev) => {
        const next: UseTransactionsState = {
          ...prev,
          ...params,
          page: params.page ?? (params.search !== undefined ? 1 : prev.page),
        };
        fetchTransactions(next);
        return next;
      });
    },
    [fetchTransactions]
  );

  return { ...state, updateQuery, refetch: () => fetchTransactions(state) };
}
