"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-base font-semibold text-slate-900 dark:text-white">
            DTC Platform
          </h1>
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-indigo-100 text-center text-xs leading-8 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              A
            </span>
          </div>
        </header>

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" richColors closeButton />
    </div>
  );
}
