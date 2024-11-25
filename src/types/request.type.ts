export type Request ={
  transactionId: string;
  resellerId: unknown; 
  creditAmount: number; 
  status: "pending" | "done"; 
  createdAt?: Date; 
  updatedAt?: Date; 
  }