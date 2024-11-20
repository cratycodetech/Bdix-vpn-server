
export interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string; 
    role?: "admin" | "reseller" | "user"; 
    status?: "ACTIVE" | "INACTIVE";
    createdAt?: Date; 
    updatedAt?: Date; 
  }