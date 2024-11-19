import bcrypt from "bcrypt";
import { Model, model, models, Schema } from "mongoose";
import validator from "validator";
import { Admin } from "../types/admin.type";

const adminSchema = new Schema<Admin>(
  {
    name:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err as undefined);
  }
});

const Admin: Model<Admin> = models?.Admin || model("Admin", adminSchema);
export default Admin;
