
export type UserCreditRequest = {
  userId: unknown; 
  creditAmount: number; 
  status: "pending" | "done"; 
  requestTo: "Admin" | "Reseller";
  resellerId?: unknown; 
  createdAt?: Date; 
  updatedAt?: Date;           
}
