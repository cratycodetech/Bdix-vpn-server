import { model, Model, models, Schema } from "mongoose";
import { PremiumUser } from "../types/premiumUser.type";

const ObjectId = Schema.Types.ObjectId;

const premiumUserSchema = new Schema<PremiumUser>(
  {
    userId: {
      type: ObjectId,
      ref: "User",
    },
    userType: { type: String, enum: ["Premium", "Free"],default:"Free" },
    subscriptionStatus: { type: String, enum: ["Active", "Expired", "Inactive"] ,default:"Inactive"},
    subscriptionType:{
        type: String,
        enum: ["3 month", "6 month","1 year"]
    },
    credits: { type: Number, default: 0 },
    resellerReference:{
        type: ObjectId,
        ref: "User"
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);


const PremiumUser: Model<PremiumUser> = models?.PremiumUser || model("PremiumUser", premiumUserSchema);
export default PremiumUser;
