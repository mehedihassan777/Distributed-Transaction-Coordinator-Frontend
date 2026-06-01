"use client";

import { DataTable, type ColumnDef } from "@/components/data-table/DataTable";
import { useProducts } from "./useProducts";
import type { Product } from "./types";

const COLUMNS: ColumnDef<Product>[] = [
  { key: "sku", header: "SKU", sortable: true },
  { key: "name", header: "Name", sortable: true },
  { key: "category", header: "Category", sortable: true },
  {
    key: "price",
    header: "Price",
    sortable: true,
    cell: (row) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.price),
  },
  { key: "stockQuantity", header: "Stock", sortable: true },
];

export function ProductsTable() {
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
  } = useProducts();

  return (
    <DataTable<Product>
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
