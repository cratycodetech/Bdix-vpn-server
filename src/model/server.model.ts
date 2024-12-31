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
    
    protocal: {
        type: String,
    },
    userName: {
        type: String,
    },
    serverLocation: {
      type: String,
      required: true,
    },
    serverTag: {
        type: String,
        enum: ['Instagram', 'Google ads'],
        default: 'Google ads',
    },
    receivedMbps:{
        type: Number,
        default: 0
    },
    transmittedMbps:{
        type: Number,
        default: 0
    },
    status: {
        type:String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    password: String,
    
    connectedUsers: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Server: Model<Server> = models?.Server || model("Server", serverSchema);
export default Server;
