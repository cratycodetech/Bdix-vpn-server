import { model, Model, models, Schema } from "mongoose";
import { TransferHistory } from "../types/transferHistory.type";

const ObjectId = Schema.Types.ObjectId;

const transferHistorySchema = new Schema<TransferHistory>(
  {
    creditAmount: {
      type: Number,
    },
    resellerId: {
      type: ObjectId,
      ref: "User", 
      required: true,
    },
    transferredBy: {
      type: ObjectId,
      ref: "User", 
    },
    transferDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);


const TransferHistory: Model<TransferHistory> = models?.transferHistory || model("TransferHistory", transferHistorySchema);
export default TransferHistory;









