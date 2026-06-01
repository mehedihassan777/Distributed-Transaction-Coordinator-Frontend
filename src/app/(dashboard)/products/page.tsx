import React from "react";
import { ProductsTable } from "@/features/products/components/products-table";

export const metadata = {
  title: "Products | DTC Platform",
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Products</h2>
        <p className="text-sm text-slate-500">Manage inventory across all tenant services.</p>
      </div>
      <ProductsTable />
    </div>
  );
}
