import { model, Model, models, Schema } from "mongoose";
import { ServerActiveUser } from "../types/serverActiveUser.type";
const ObjectId = Schema.Types.ObjectId;


const ServerActiveUserSchema = new Schema<ServerActiveUser >(
  {
    userId: {
      type: ObjectId,
      ref:"User"    
    },
    serverIP: {
      type: String
    },
    userStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    }
  },
  {
    timestamps: true,
  },
);


const ServerActiveUser : Model<ServerActiveUser> = models?.ServerActiveUser || model("ServerActiveUser", ServerActiveUserSchema);
export default ServerActiveUser ;
