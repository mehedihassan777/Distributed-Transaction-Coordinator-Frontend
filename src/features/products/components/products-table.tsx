"use client";

import React from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { useProducts } from "../hooks/use-products";
import type { Product } from "../types";

const COLUMNS: ColumnDef<Product>[] = [
  { key: "sku", header: "SKU", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "category", header: "Category", sortable: true },
  {
    key: "price",
    header: "Price",
    sortable: true,
    cell: (row) =>
      new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.price),
  },
  {
    key: "stock",
    header: "Stock",
    sortable: true,
    cell: (row) => (
      <span className={row.stock < 10 ? "font-semibold text-red-600" : ""}>{row.stock}</span>
    ),
  },
  {
    key: "updatedAt",
    header: "Last Updated",
    sortable: true,
    cell: (row) => new Date(row.updatedAt).toLocaleDateString(),
  },
];

export function ProductsTable() {
  const { data, total, page, pageSize, sortBy, sortOrder, search, isLoading, updateQuery } =
    useProducts();

  return (
    <DataTable<Product>
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
  );
}
