"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export interface DataTableState {
  page: number;
  pageSize: number;
  search: string;
  sort: SortConfig | null;
}

export interface UseDataTableOptions {
  defaultPageSize?: number;
  debounceMs?: number;
}

export interface UseDataTableReturn extends DataTableState {
  debouncedSearch: string;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearch: (search: string) => void;
  setSort: (column: string) => void;
}

export function useDataTable({
  defaultPageSize = 10,
  debounceMs = 350,
}: UseDataTableOptions = {}): UseDataTableReturn {
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSortState] = useState<SortConfig | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPageState(1); // reset to first page on new search
    }, debounceMs);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [search, debounceMs]);

  const setPage = useCallback((p: number) => setPageState(p), []);

  const setPageSize = useCallback((ps: number) => {
    setPageSizeState(ps);
    setPageState(1);
  }, []);

  const setSearch = useCallback((s: string) => setSearchState(s), []);

  const setSort = useCallback((column: string) => {
    setSortState((prev) => {
      if (!prev || prev.column !== column) {
        return { column, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { column, direction: "desc" };
      }
      return null; // third click removes sort
    });
    setPageState(1);
  }, []);

  return {
    page,
    pageSize,
    search,
    debouncedSearch,
    sort,
    setPage,
    setPageSize,
    setSearch,
    setSort,
  };
}
