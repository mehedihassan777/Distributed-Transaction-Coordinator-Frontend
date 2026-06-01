/**
 * Dashboard shell layout — Server Component wrapper.
 *
 * The <Sidebar> and <Header> are Client Components (they use useState/
 * usePathname), but they are imported here in a Server Component — Next.js
 * will automatically split them into a separate JS bundle and stream the
 * static HTML for the shell on the server, while only hydrating the
 * interactive parts on the client.
 */
import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Collapsible sidebar — Client Component island */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header bar — Client Component island */}
        <Header title="DTC Platform" />

        {/* Page content — Server Components render here */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
