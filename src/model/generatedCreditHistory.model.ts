import mongoose, { model, Model, models, Schema } from "mongoose";
import { GeneratedCreditHistory } from "../types/generatedCreditHistory.type";
const ObjectId = Schema.Types.ObjectId;


const generatedCreditHistorySchema = new Schema< GeneratedCreditHistory>(
  {
    credit: {
      type: Number,
    },
    totalCredit: {
      type: Number,
    },
    availableCredit: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const  GeneratedCreditHistory: Model< GeneratedCreditHistory> = models?. GeneratedCreditHistory || model("GeneratedCreditHistory",  generatedCreditHistorySchema);
export default  GeneratedCreditHistory;
