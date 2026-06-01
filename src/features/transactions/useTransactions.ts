"use client";

import { useCallback, useEffect, useState } from "react";
import { useDataTable } from "@/hooks/useDataTable";
import { apiFetch, buildQueryString, type PaginatedResponse } from "@/lib/api";
import type { Transaction } from "./types";
import { toast } from "sonner";

export function useTransactions() {
  const tableState = useDataTable({ defaultPageSize: 10 });
  const [data, setData] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Increment to trigger a manual refresh without changing table params.
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setIsLoading(true);
      try {
        const qs = buildQueryString({
          page: tableState.page,
          pageSize: tableState.pageSize,
          search: tableState.debouncedSearch,
          sortColumn: tableState.sort?.column,
          sortDirection: tableState.sort?.direction,
        });
        const result = await apiFetch<PaginatedResponse<Transaction>>(
          `/transactions${qs}`,
          { signal: controller.signal },
        );
        if (!controller.signal.aborted) {
          setData(result.data);
          setTotal(result.total);
        }
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          const msg =
            err instanceof Error ? err.message : "Unknown error";
          if (msg !== "AbortError") {
            toast.error("Failed to load transactions. Please try again.");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [
    tableState.page,
    tableState.pageSize,
    tableState.debouncedSearch,
    tableState.sort,
    refreshToken,
  ]);

  const refresh = useCallback(() => setRefreshToken((t) => t + 1), []);

  return {
    ...tableState,
    data,
    total,
    isLoading,
    refresh,
  };
}
