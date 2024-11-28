export interface Credit {
    credit: number; 
    totalCredit: number;
    fixedTotalCredit: number;
    adminId?: string; 
    history?: {
      action: string;
      credit: number;
      date?: Date;
    }[];
    createdAt?: Date; 
    updatedAt?: Date; 
  }
  