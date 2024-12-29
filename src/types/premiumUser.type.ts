export interface PremiumUser {
    userId: unknown; 
    userType: "Premium" | "Free";
    subscriptionStatus: "Active" | "Expired" | "Inactive"; 
    subscriptionType: "Monthly" | "Yearly";
    credits: number; 
    resellerReference: unknown; 
    startDate: Date;
    endDate: Date;
    createdAt?: Date; 
    updatedAt?: Date; 
  }