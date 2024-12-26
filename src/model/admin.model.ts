import { Model, model, models, Schema } from "mongoose";
import { Admin } from "../types/admin.type";

const ObjectId = Schema.Types.ObjectId;

const adminSchema = new Schema<Admin>(
  {
    adminId:{
      type: ObjectId,
      ref: "User",
    },
    email:{
      type:String,
    },
    image:{
      type:String
    }
  },
  {
    timestamps: true,
  },
);


const Admin: Model<Admin> = models?.Admin || model("Admin", adminSchema);
export default Admin;
