import { TransactionsTable } from "@/features/transactions/TransactionsTable";
import { DataTableSkeleton } from "@/components/data-table/DataTableSkeleton";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | DTC Platform",
};

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transactions
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Monitor and inspect distributed transactions across services.
        </p>
      </div>

      <Suspense fallback={<DataTableSkeleton columns={5} rows={10} />}>
        <TransactionsTable />
      </Suspense>
    </div>
  );
}
