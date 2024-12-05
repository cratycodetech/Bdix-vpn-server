export type ServerActiveUser = {
    _id: string; 
    userId:unknown;
    serverIP: string;
    userStatus: "active" | "inactive";
    date: Date;
    createdAt?: Date;
    updatedAt?: Date
  }
  