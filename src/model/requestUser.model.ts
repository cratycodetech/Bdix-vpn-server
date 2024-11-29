
import { model, Model, models, Schema } from "mongoose";
import { RequestUser } from "../types/requestUser.type"

const ObjectId = Schema.Types.ObjectId;

const requestUserSchema = new Schema<RequestUser>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true, 
    },
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


const RequestUser: Model<RequestUser> = models?.RequestUser || model("RequestUser", requestUserSchema);
export default RequestUser;
