import { Suspense } from "react";
import { StatsCard, StatsCardSkeleton } from "@/features/dashboard/StatsCard";
import { fetchDashboardStats } from "@/features/dashboard/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | DTC Platform",
};

async function Stats() {
  const stats = await fetchDashboardStats();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <StatsCard label="Total Transactions" value={stats.totalTransactions} />
      <StatsCard
        label="Pending"
        value={stats.pendingTransactions}
        description="Awaiting commit/abort"
      />
      <StatsCard
        label="Committed"
        value={stats.committedTransactions}
        description="Successfully completed"
      />
      <StatsCard
        label="Aborted"
        value={stats.abortedTransactions}
        description="Rolled back"
      />
      <StatsCard label="Total Products" value={stats.totalProducts} />
      <StatsCard
        label="Low Stock"
        value={stats.lowStockProducts}
        description="Needs reordering"
      />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Real-time overview of distributed transaction health.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
    </div>
  );
}
