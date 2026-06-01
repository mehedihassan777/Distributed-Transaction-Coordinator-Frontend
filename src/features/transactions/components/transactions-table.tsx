"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTransactions } from "../hooks/use-transactions";
import type { Transaction, TransactionStatus } from "../types";

const STATUS_VARIANT: Record<
  TransactionStatus,
  "default" | "success" | "warning" | "destructive" | "outline"
> = {
  committed: "success",
  pending: "warning",
  compensating: "warning",
  rolled_back: "destructive",
  aborted: "destructive",
};

const COLUMNS: ColumnDef<Transaction>[] = [
  { key: "correlationId", header: "Correlation ID", sortable: true },
  { key: "service", header: "Service", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (row) => (
      <Badge variant={STATUS_VARIANT[row.status]}>
        {row.status.replace("_", " ")}
      </Badge>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    sortable: true,
    cell: (row) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.amount),
  },
  {
    key: "createdAt",
    header: "Created",
    sortable: true,
    cell: (row) => new Date(row.createdAt).toLocaleString(),
  },
];

/**
 * Client Component that owns the interactive transactions table.
 * The parent RSC page can pass pre-fetched initial data (for SSR),
 * and this component takes over client-side querying from there.
 */
export function TransactionsTable() {
  const { data, total, page, pageSize, sortBy, sortOrder, search, isLoading, refetch, updateQuery } =
    useTransactions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Transactions</h2>
          <p className="text-sm text-slate-500">Monitor all distributed transactions across services.</p>
        </div>
        <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </Button>
      </div>

      <DataTable<Transaction>
        columns={COLUMNS}
        data={data}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        search={search}
        onQueryChange={updateQuery}
      />
    </div>
  );
}
