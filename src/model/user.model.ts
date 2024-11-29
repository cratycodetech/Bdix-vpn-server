import bcrypt from "bcrypt";
import { model, Model, models, Schema } from "mongoose";
import validator from "validator";
import { User } from "../types/user.type";

const userSchema = new Schema<User>(
  {
    name: {
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
    phone: String,
    role: {
      type: String,
      enum: ["Admin", "Reseller","User"],
      default: "User",
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

userSchema.pre("save", async function (next) {
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

const User: Model<User> = models?.User || model("User", userSchema);
export default User;
