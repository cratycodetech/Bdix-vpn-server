
export type RequestUser = {
  transactionId: string;
  userId: unknown; 
  creditAmount: number; 
  status: "pending" | "done"; 
  createdAt?: Date; 
  updatedAt?: Date;           
}
