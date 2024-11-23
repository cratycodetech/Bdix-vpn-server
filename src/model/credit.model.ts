import mongoose, { Model, model, models, Schema } from "mongoose";
import { Credit } from "../types/credit.type";
import User from "./user.model";

const ObjectId = Schema.Types.ObjectId;


const creditSchema = new Schema<Credit>(
  {
    credit: {
        type: Number,
        required: true,
        min: [50, "Credit cannot be less than 50"],
    },
    totalCredit: {
        type: Number,
        default: 0,
        required: true,
    },
    adminId: {
        type: ObjectId,
        ref: "Admin",
    },
  },
  {
    timestamps: true,
  },
);

const Credit: Model<Credit> = models?.Credit || model("Credit", creditSchema);
export default Credit;
