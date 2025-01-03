import mongoose, { model, Model, models, Schema } from "mongoose";
import { Request } from "../types/request.type";
const ObjectId = Schema.Types.ObjectId;

const requestSchema = new Schema<Request>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true, 
    },
    paymentMethod:{
      type: String,
      enum: ["Bkash", "Nogod", "Rocket","Card","Cash"],
      required: true
    },
    MoneyAmount: {
      type: Number,
      required: true,
      min: [100, "Money amount must be at least 100"],
    },
    resellerId: {
      type: ObjectId,
      refPath: "User", 
      required: true,
    },
    creditAmount: {
      type: Number,
      required: true,
      min: [1, "Credit amount must be at least 1"], 
    },
    status: {
      type: String,
      enum: ["pending", "done"], 
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);



const Request: Model<Request> = models?.Request || model("Request", requestSchema);
export default Request;
