import mongoose, { model, Model, models, Schema } from "mongoose";
import { Guest } from "../types/guestUser.type";
const ObjectId = Schema.Types.ObjectId;

const guestSchema = new Schema<Guest>(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true, 
    },
    userId: {
      type:String,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);



const Guest: Model<Guest> = models?.Guest || model("Guest", guestSchema);
export default Guest;
