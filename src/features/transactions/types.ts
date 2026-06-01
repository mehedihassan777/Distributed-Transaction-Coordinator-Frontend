// Shared transaction types consumed by RSC pages and client hooks

export type TransactionStatus = "pending" | "committed" | "rolled_back" | "compensating";

export interface Transaction {
  id: string;
  correlationId: string;
  tenantId: string;
  status: TransactionStatus;
  service: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}
