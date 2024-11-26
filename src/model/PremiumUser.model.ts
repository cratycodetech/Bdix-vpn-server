import { model, Model, models, Schema } from "mongoose";
import { PremiumUser } from "../types/premiumUser.type";

const ObjectId = Schema.Types.ObjectId;

const premiumUserSchema = new Schema<PremiumUser>(
  {
    UserId: {
      type: ObjectId,
      ref: "User",
    },
    userType: { type: String, enum: ["Premium", "Free"] },
    subscriptionStatus: { type: String, enum: ["Active", "Expired", "Inactive"] },
    subscriptionType:{
        type: String,
        enum: ["Monthly", "Yearly"]
    },
    credits: { type: Number, default: 0 },
    resellerReference: String,
  },
  {
    timestamps: true,
  },
);


const PremiumUser: Model<PremiumUser> = models?.PremiumUser || model("PremiumUser", premiumUserSchema);
export default PremiumUser;
