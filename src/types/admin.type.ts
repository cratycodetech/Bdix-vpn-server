export type Admin = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin";
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
};
