
export type UserCreditRequest = {
  userId: unknown; 
  creditAmount: number; 
  status: "pending" | "done"; 
  requestTo: "Admin" | "Reseller";
  resellerId?: unknown; 
  paymentMethod: "Bkash" | "Nogod" | "Rocket" | "Card" | "Cash";
  MoneyAmount: number;
  createdAt?: Date; 
  updatedAt?: Date;           
}
