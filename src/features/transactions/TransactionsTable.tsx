"use client";

import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "./useTransactions";
import type { Transaction } from "./types";

const STATUS_VARIANT: Record<
  Transaction["status"],
  "default" | "success" | "destructive" | "warning" | "secondary"
> = {
  committed: "success",
  pending: "warning",
  compensating: "secondary",
  aborted: "destructive",
};

const COLUMNS: ColumnDef<Transaction>[] = [
  { key: "id", header: "ID", sortable: true },
  { key: "correlationId", header: "Correlation ID", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (row) => (
      <Badge variant={STATUS_VARIANT[row.status]}>{row.status}</Badge>
    ),
  },
  { key: "participantCount", header: "Participants", sortable: true },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    cell: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

export function TransactionsTable() {
  const {
    data,
    total,
    page,
    pageSize,
    search,
    sort,
    isLoading,
    setPage,
    setPageSize,
    setSearch,
    setSort,
  } = useTransactions();

  return (
    <DataTable<Transaction>
      columns={COLUMNS}
      data={data}
      total={total}
      page={page}
      pageSize={pageSize}
      search={search}
      sort={sort}
      isLoading={isLoading}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      onSearchChange={setSearch}
      onSortChange={setSort}
    />
  );
}
