import { Model, model, models, Schema } from "mongoose";
import { Server } from "../types/server.type";

const serverSchema = new Schema<Server>(
  {
    serverName: {
        type: String,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    serverLocation: {
        type: String,
        required: true,
    },
    CPUallocation: {
        type: String,
    },
    memoryAllocation: {
        type: String,
      },
     
    serverTag: {
        type: String,
        enum: ['Instagram', 'Google ads'],
        default: 'Google ads',
    },
    status: {
        type:String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    password: String
  },
  {
    timestamps: true,
  },
);

const Server: Model<Server> = models?.Server || model("Server", serverSchema);
export default Server;
