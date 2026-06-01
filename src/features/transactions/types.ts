export type TransactionStatus =
  | "pending"
  | "committed"
  | "aborted"
  | "rolled_back"
  | "compensating";

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
