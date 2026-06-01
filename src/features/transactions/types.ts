export interface Transaction {
  id: string;
  tenantId: string;
  status: "pending" | "committed" | "aborted" | "compensating";
  createdAt: string;
  updatedAt: string;
  participantCount: number;
  correlationId: string;
}
