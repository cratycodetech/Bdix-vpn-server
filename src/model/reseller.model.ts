import { model, Model, models, Schema } from "mongoose";
import { Reseller as ResellerType } from "../types/reseller.type";

const ObjectId = Schema.Types.ObjectId;

const resellerSchema = new Schema<ResellerType>(
  {
    resellerId: {
      type: ObjectId,
      ref: "User",
    },
    email:String,
    totalCredit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Reseller: Model<ResellerType> = models?.Reseller || model("Reseller", resellerSchema);

export default Reseller;
