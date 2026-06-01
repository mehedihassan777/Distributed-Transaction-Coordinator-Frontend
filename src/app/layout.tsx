/**
 * Root layout — Server Component.
 *
 * Responsibilities:
 *   • Apply global fonts and base CSS.
 *   • Render the Sonner <Toaster> for app-wide toast notifications.
 *   • Keep this file intentionally minimal: all feature-specific state
 *     lives inside Client Component islands deeper in the tree.
 */
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "DTC Platform | Distributed Transaction Coordinator",
  description:
    "Multi-tenant Distributed Transaction Coordinator dashboard — monitor and manage cross-service transactions in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        {children}
        {/*
         * Toaster is a Client Component provided by "sonner".
         * It renders a portal at the bottom of the document and is the
         * single source of toast notifications across the entire app.
         * Call toast() / toast.error() etc. from any Client Component.
         */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
