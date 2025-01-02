
export type UserCreditRequest = {
  userId: { name: string } | null | unknown; // Populated object or unknown
  creditAmount: number;
  status: "pending" | "done";
  requestTo: "Admin" | "Reseller";
  resellerId?: { name: string } | null | unknown; // Populated object or unknown
  paymentMethod: "Bkash" | "Nogod" | "Rocket" | "Card" | "Cash";
  MoneyAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
};