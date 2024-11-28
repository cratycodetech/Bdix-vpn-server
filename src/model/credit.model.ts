import mongoose, { Model, model, models, Schema } from "mongoose";
import { Credit } from "../types/credit.type";
import creditHistorySchema from "../model/creditHistory.model";


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
    },
    adminId: {
        type: ObjectId,
        ref: "Admin",
    },
    fixedTotalCredit:{
        type: Number,
        default: 0
    },
    history: [creditHistorySchema],
    // transferHistory: [creditTransferSchema], // Nested schema for transfers
  
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to ensure totalCredit aligns with the initial credit value
creditSchema.pre("save", function (next) {
  if (this.isNew) {
    this.totalCredit = this.credit; 
    this.fixedTotalCredit = this.credit;
  }
  next();
});


const Credit: Model<Credit> = models?.Credit || model("Credit", creditSchema);
export default Credit;



