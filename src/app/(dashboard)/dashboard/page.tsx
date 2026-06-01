/**
 * Dashboard home page — React Server Component.
 *
 * <StatsOverview> fetches data on the server.  The Suspense boundary
 * renders skeleton cards while the async fetch resolves, ensuring the
 * page is never blank during loading.
 */
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsOverview } from "@/features/dashboard/components/stats-overview";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="mt-2 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Real-time overview of your distributed transaction platform.
        </p>
      </div>

      {/* RSC data fetch wrapped in Suspense for skeleton loading */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsOverview />
      </Suspense>
    </div>
  );
}
