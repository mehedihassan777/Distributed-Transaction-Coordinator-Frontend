/**
 * Transactions page — React Server Component shell.
 *
 * The <TransactionsTable> is a Client Component that manages its own
 * fetch lifecycle via the useTransactions hook.  We import it here in
 * an RSC, so Next.js will:
 *   1. Render the static shell HTML on the server.
 *   2. Stream the page to the browser immediately.
 *   3. Hydrate only the interactive table island on the client.
 */
import React from "react";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";

export const metadata = {
  title: "Transactions | DTC Platform",
};

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <TransactionsTable />
    </div>
  );
}
