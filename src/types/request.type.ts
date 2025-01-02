export type Request ={
  transactionId: string;
  paymentMethod: "Bkash" | "Nogod" | "Rocket" | "Card" | "Cash";
  MoneyAmount: number;
  resellerId: unknown; 
  creditAmount: number; 
  status: "pending" | "done"; 
  createdAt?: Date; 
  updatedAt?: Date; 
  }