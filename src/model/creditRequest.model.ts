import mongoose, { model, Model, models, Schema } from "mongoose";
import { Request } from "../types/request.type";
const ObjectId = Schema.Types.ObjectId;

const requestSchema = new Schema<Request>(
  {
    reseller: {
        type: ObjectId,
        ref: "Reseller",
      },
    creditAmount: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);



const Request: Model<Request> = models?.Request || model("Request", requestSchema);
export default Request;
