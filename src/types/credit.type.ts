export interface Credit {
    credit: number; 
    availableCredit: number;
    totalCredit: number;
    adminId?: string; 
    history?: {
      action: string;
      credit: number;
      date?: Date;
    }[];
    createdAt?: Date; 
    updatedAt?: Date; 
  }
  