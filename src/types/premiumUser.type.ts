export interface PremiumUser {
    userId: unknown; 
    userType: "Premium" | "Free";
    subscriptionStatus: "Active" | "Expired" | "Inactive"; 
    subscriptionType: "1 month" | "3 month" | "6 month" | " 1 Year";
    credits: number; 
    resellerReference: unknown; 
    startDate: Date;
    endDate: Date;
    createdAt?: Date; 
    updatedAt?: Date; 
  }