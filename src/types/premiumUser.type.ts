export interface PremiumUser {
    userId: unknown; 
    userType: "Premium" | "Free";
    subscriptionStatus: "Active" | "Expired" | "Inactive"; 
    subscriptionType: "Monthly" | "Yearly";
    credits: number; 
    resellerReference: string; 
    createdAt?: Date; 
    updatedAt?: Date; 
  }