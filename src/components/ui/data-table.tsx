"use client";

import React, { useCallback, useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

export interface ColumnDef<TData> {
  /** Unique key — also used as the sort field sent to the server */
  key: string;
  header: string;
  cell?: (row: TData) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<TData> {
  /** Array of column definitions */
  columns: ColumnDef<TData>[];
  /** Rows for the current page (already fetched) */
  data: TData[];
  /** Total rows across all pages — used to compute page count */
  total: number;
  /** Current page (1-based) */
  page: number;
  /** Rows per page */
  pageSize: number;
  /** Whether the parent is fetching data */
  isLoading?: boolean;
  /** Current sort column key */
  sortBy?: string;
  /** Current sort direction */
  sortOrder?: "asc" | "desc";
  /** Current search string */
  search?: string;
  /** Called when the user changes page, sort, or search */
  onQueryChange: (params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
  }) => void;
}

// --------------------------------------------------------------------------
// Sort icon helper
// --------------------------------------------------------------------------

function SortIcon({ column, sortBy, sortOrder }: { column: string; sortBy?: string; sortOrder?: "asc" | "desc" }) {
  if (sortBy !== column) return <ChevronsUpDown className="ml-1 h-3 w-3 text-slate-400" aria-hidden />;
  return sortOrder === "asc"
    ? <ChevronUp className="ml-1 h-3 w-3" aria-hidden />
    : <ChevronDown className="ml-1 h-3 w-3" aria-hidden />;
}

// --------------------------------------------------------------------------
// DataTable
// --------------------------------------------------------------------------

export function DataTable<TData extends object>({
  columns,
  data,
  total,
  page,
  pageSize,
  isLoading = false,
  sortBy,
  sortOrder,
  search = "",
  onQueryChange,
}: DataTableProps<TData>) {
  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Fire the query change when the debounced search changes
  const prevSearchRef = React.useRef(search);
  React.useEffect(() => {
    if (debouncedSearch !== prevSearchRef.current) {
      prevSearchRef.current = debouncedSearch;
      onQueryChange({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, onQueryChange]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSort = useCallback(
    (key: string) => {
      if (sortBy === key) {
        onQueryChange({ sortBy: key, sortOrder: sortOrder === "asc" ? "desc" : "asc", page: 1 });
      } else {
        onQueryChange({ sortBy: key, sortOrder: "asc", page: 1 });
      }
    },
    [sortBy, sortOrder, onQueryChange]
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
        <Input
          aria-label="Search"
          placeholder="Search…"
          className="pl-8"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center font-medium hover:text-slate-900"
                      onClick={() => handleSort(col.key)}
                      aria-label={`Sort by ${col.header}`}
                    >
                      {col.header}
                      <SortIcon column={col.key} sortBy={sortBy} sortOrder={sortOrder} />
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton loader rows
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i} aria-hidden>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-slate-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          {total === 0
            ? "No records"
            : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={page <= 1 || isLoading}
            onClick={() => onQueryChange({ page: page - 1 })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={page >= totalPages || isLoading}
            onClick={() => onQueryChange({ page: page + 1 })}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
