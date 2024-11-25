import mongoose, { model, Model, models, Schema } from "mongoose";
import { Request } from "../types/request.type";
const ObjectId = Schema.Types.ObjectId;

const requestSchema = new Schema<Request>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true, // Ensures every request has a unique transaction ID
    },
    resellerId: {
      type: ObjectId,
      refPath: "User", // Dynamically references either 'Reseller' or 'User'
      required: true,
    },
    creditAmount: {
      type: Number,
      required: true,
      min: [1, "Credit amount must be at least 1"], // Validation for minimum credit amount
    },
    status: {
      type: String,
      enum: ["pending", "done"], // Status of the request
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);



const Request: Model<Request> = models?.Request || model("Request", requestSchema);
export default Request;
