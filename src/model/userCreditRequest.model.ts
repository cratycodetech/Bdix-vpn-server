import { model, Model, models, Schema } from "mongoose";
import { UserCreditRequest } from "../types/userCreditRequest.type"

const ObjectId = Schema.Types.ObjectId;

const userCreditRequestSchema = new Schema<UserCreditRequest>(
  {
    userId: {
      type: ObjectId,
      refPath: "User", 
      required: true,
    },
    creditAmount: {
      type: Number,
      required: true,
      min: [1, "Credit amount must be at least 1"], 
    },
    requestTo:{
      type:String,
      enum:["Admin","Reseller"],
      default:"Reseller"
    },
    resellerId:{
      type: ObjectId,
      ref: "User", 
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


 const userCreditRequest: Model<UserCreditRequest> = models?.UserCreditRequest || model("UserCreditRequest", userCreditRequestSchema);
export default userCreditRequest;
