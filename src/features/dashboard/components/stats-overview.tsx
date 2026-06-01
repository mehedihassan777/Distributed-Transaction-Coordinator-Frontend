/**
 * StatsOverview — React Server Component.
 *
 * Fetches aggregate stats on the server during the initial render.
 * No client JS is sent for this component: the HTML is fully rendered
 * server-side and streamed to the browser.
 */
import React from "react";
import { ArrowLeftRight, Package, CheckCircle2, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api/client";
import { StatsCard } from "./stats-card";

interface DashboardStats {
  totalTransactions: number;
  committedTransactions: number;
  failedTransactions: number;
  totalProducts: number;
}

async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await api.get<DashboardStats>("/dashboard/stats");
  } catch {
    // Return zeroed stats rather than breaking the page
    return {
      totalTransactions: 0,
      committedTransactions: 0,
      failedTransactions: 0,
      totalProducts: 0,
    };
  }
}

export async function StatsOverview() {
  const stats = await getDashboardStats();

  const successRate =
    stats.totalTransactions > 0
      ? ((stats.committedTransactions / stats.totalTransactions) * 100).toFixed(1)
      : "N/A";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Transactions"
        value={stats.totalTransactions.toLocaleString()}
        description="All-time across all tenants"
        icon={<ArrowLeftRight className="h-4 w-4" />}
      />
      <StatsCard
        title="Committed"
        value={stats.committedTransactions.toLocaleString()}
        description={`${successRate}% success rate`}
        trend="up"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      />
      <StatsCard
        title="Failed / Rolled Back"
        value={stats.failedTransactions.toLocaleString()}
        description="Requires investigation"
        trend={stats.failedTransactions > 0 ? "down" : "neutral"}
        icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
      />
      <StatsCard
        title="Products"
        value={stats.totalProducts.toLocaleString()}
        description="Across all tenants"
        icon={<Package className="h-4 w-4" />}
      />
    </div>
  );
}
