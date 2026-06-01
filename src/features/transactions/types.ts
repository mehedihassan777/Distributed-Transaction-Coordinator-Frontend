export type TransactionStatus =
  | "pending"
  | "committed"
  | "aborted"
  | "rolled_back"
  | "compensating";

export interface Transaction {
  id: string;
  tenantId: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  correlationId: string;
  participantCount: number;
  service: string;
  amount: number;
}
