"use client";

import * as React from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SortConfig } from "@/hooks/useDataTable";

export interface ColumnDef<T> {
  key: string;
  header: string;
  sortable?: boolean;
  cell?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  sort: SortConfig | null;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (column: string) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function SortIcon({
  column,
  sort,
}: {
  column: string;
  sort: SortConfig | null;
}) {
  if (!sort || sort.column !== column) {
    return <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-slate-400" aria-hidden />;
  }
  return sort.direction === "asc" ? (
    <ChevronUp className="ml-1 h-3.5 w-3.5" aria-hidden />
  ) : (
    <ChevronDown className="ml-1 h-3.5 w-3.5" aria-hidden />
  );
}

export function DataTable<T extends object>({
  columns,
  data,
  total,
  page,
  pageSize,
  search,
  sort,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
          aria-label="Search table"
        />
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-slate-200 bg-transparent px-2 py-1 text-sm dark:border-slate-700"
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm" role="table">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left font-medium text-slate-700 dark:text-slate-300 select-none",
                    col.sortable &&
                      "cursor-pointer hover:text-slate-900 dark:hover:text-white",
                  )}
                  onClick={col.sortable ? () => onSortChange(col.key) : undefined}
                  aria-sort={
                    sort?.column === col.key
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : col.sortable
                        ? "none"
                        : undefined
                  }
                >
                  <span className="inline-flex items-center">
                    {col.header}
                    {col.sortable && (
                      <SortIcon column={col.key} sort={sort} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  <span className="sr-only">Loading</span>
                  <div
                    className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
                    role="status"
                    aria-label="Loading"
                  />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No results found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-t border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-800/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-slate-800 dark:text-slate-200"
                    >
                      {col.cell
                        ? col.cell(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
          {total === 0
            ? "No records"
            : `Showing ${from}–${to} of ${total} records`}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={page === 1 || isLoading}
            aria-label="Go to first page"
          >
            «
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1 || isLoading}
            aria-label="Go to previous page"
          >
            ‹
          </Button>
          <span className="px-3 text-sm">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            aria-label="Go to next page"
          >
            ›
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages || isLoading}
            aria-label="Go to last page"
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
}
