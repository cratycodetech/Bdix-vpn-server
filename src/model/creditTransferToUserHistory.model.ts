import { model, Model, models, Schema } from "mongoose";
import { CreditTransferToUserHistory } from "../types/creditTransferToUserHistory.type";  

const ObjectId = Schema.Types.ObjectId;

const CreditTransferToUserHistorySchema = new Schema<CreditTransferToUserHistory>(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    resellerId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    creditAmount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["creditTransfer"], 
      default: "creditTransfer",
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CreditTransferToUserHistory: Model<CreditTransferToUserHistory> =
  models?.CreditTransferToUserHistory || model("CreditTransferToUserHistory", CreditTransferToUserHistorySchema);

export default CreditTransferToUserHistory;
