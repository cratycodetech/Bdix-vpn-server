import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;

const creditHistorySchema = new Schema({
  action: {
    type: String,
    enum: ["Added", "Deducted"],
    default: "Added",
  },
  credit: {
    type: Number,
  },
  adminId: {
    type: ObjectId,
    ref: "Admin",
},
  date: {
    type: Date,
    default: Date.now,
  },
});

export default creditHistorySchema;
