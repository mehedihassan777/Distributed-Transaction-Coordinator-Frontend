import { apiFetch } from "@/lib/api";
import type { DashboardStats } from "./types";

export async function fetchDashboardStats(
  serverToken?: string,
): Promise<DashboardStats> {
  return apiFetch<DashboardStats>(
    "/dashboard/stats",
    serverToken ? { serverSide: true, serverToken } : undefined,
  );
}
