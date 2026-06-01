import { ProductsTable } from "@/features/products/ProductsTable";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products | DTC Platform",
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Products
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Browse and manage product inventory with real-time stock levels.
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton columns={5} rows={10} />}>
        <ProductsTable />
      </Suspense>
    </div>
  );
}
