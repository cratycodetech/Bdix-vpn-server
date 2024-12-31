
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string; 
    otp: boolean;
    resetToken: string,
    resetTokenExpiry: Date|null,
    role?: "Admin" | "Reseller" | "User"; 
    status?: "ACTIVE" | "INACTIVE";
    createdAt?: Date; 
    updatedAt?: Date; 
  }