import { NextFunction, Request, Response } from "express";
import Server from "./../model/server.model";
import { exec } from 'child_process';  // For executing shell commands like ping or VPN control commands
import dotenv from 'dotenv';
import { pingServer } from "../utils/ping-server";
import * as os from 'os'; 
import ServerActiveUser from "../model/serverAssignmentModel";
dotenv.config();
import http from 'http';
import { Server as SocketServer } from 'socket.io'; // Socket.IO Server
import si from 'systeminformation';
import { getSocketIO } from "../utils/socket";
import logger from "node-color-log";
import axios from 'axios';
import { Client } from 'ssh2';
import { getAndStoreRealTimeData } from "../utils/realTimeData";

// get all servers
export const getAllServers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const servers = await Server.find()

    res.status(200).json({
      message: "Servers get successfully",
      data: servers,
    });
  } catch (err: any) {
    next(err)
  }
};

// get single server
export const getSingleServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const server = await Server.findOne({ _id: req.params.id });

    if (!server) {
      throw new Error("Server Not found")
    }

    res.status(200).json({
      message: "Server get successfully",
      data: server,
    });
  } catch (err: any) {
    next(err)
  }
};

// get all servers filter by status
export const getAllServerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const servers = await Server.find({ status: req.params.status});

    if (!servers) {
      throw new Error("servers not found")
    }

    res.status(200).json({
      message: "Servers status get successfully",
      data: servers,
    });
  } catch (err: any) {
    next(err)
  }
};

// get  count all active servers
export const getCountActiveServer = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const activeCount = await Server.countDocuments({ status: "active" });
  
      res.status(200).json({
        message: "active servers count get successfully",
        data: activeCount,
      });
    } catch (err: any) {
      next(err)
    }
  };
  

// create new server
export const createServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    if (Object.keys(data).length === 0) {
      throw new Error("Data can't be empty")
    }

    const server = await Server.create(data);

    res.status(201).json({
      message: "Server created Successfully",
      data: server,
    });
  } catch (err: any) {
    next(err)
  }
};

// update a server
export const updateServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serverId = req.params.id;
    const server = await Server.findById(serverId);

    if (!server) {
      throw new Error("Server not found")
    }

    const updatedServer = await Server.findByIdAndUpdate(serverId, req.body);

    res.status(200).json({
      message: "Server updated successfully",
      data: updatedServer,
    });
  } catch (err: any) {
    next(err)
  }
};

// delete server
export const deleteServer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const server = await Server.findByIdAndDelete(req.params.id);

    if (!server) {
      throw new Error("Server not found")
    }

    res.status(200).json({
      message: "Server Deleted Successfully",
    });
  } catch (err: any) {
    next(err)
  }
};

// update server status
export const updateServerStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true },
    );

    if (!server) {
      throw new Error("server not found")
    }

    res.status(200).json({
      message: " server status changed successfully",
      data: server,
    });
  } catch (err: any) {
    next(err)
  }
};


// Get VPN Server Status
export const checkVpnStatus = async (req: Request, res: Response) => {
  const VPN_SERVER_IP = process.env.VPN_SERVER_IP || '5.161.52.6';

  try {
    const pingCommand = os.platform() === 'win32' ? `ping -n 4 ${VPN_SERVER_IP}` : `ping -c 4 ${VPN_SERVER_IP}`;
    const result = await executeCommand(pingCommand);
    
    return res.status(200).json({ message: 'VPN is connected', status: 'online', result });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to connect to the VPN server', error: error.message });
  }
};

// Controller to get active users
export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const activeUsers = await ServerActiveUser.find({ userStatus: 'active' });
    return res.status(200).json({ message: 'Active users fetched successfully', users: activeUsers });
  } catch (error:any) {
    return res.status(500).json({ message: 'Error fetching active users', error: error.message });
  }
};

//server load in particular server
export const getServerLoad = async (req: Request, res: Response) => {
  try {
    const serverIP = req.params.serverIP;
    const command = `uptime`; // Replace with the command you want to execute on the server
    const result = await executeCommand(command);
    return res.status(200).json({ message: 'Server load fetched successfully', load: result });
  } catch (error:any) {
    return res.status(500).json({ message: 'Error fetching server load', error: error.message });
  }
};

// Route to fetch server load
// const getServerMetrics = (ipAddress: string, port: number, username: string, password: string): Promise<{ load: { load1: number, load5: number, load15: number }, users: string[], traffic: { receivedKbps: number, transmittedKbps: number } }> => {
//   return new Promise((resolve, reject) => {
//     const conn = new Client();

//     conn
//       .on('ready', () => {
//         conn.exec('uptime && who && ifstat 1 1', (err, stream) => {
//           if (err) return reject(err);

//           let output = '';
//           stream.on('data', (data: Buffer) => {
//             output += data.toString();
//           })
//             .on('close', () => {
//               conn.end();
//               try {
//                 const [uptimeOutput, whoOutput, ifstatOutput] = output.split('\n\n');

//                 // Parse load average
//                 const loadMatch = uptimeOutput.match(/load average: ([0-9.]+), ([0-9.]+), ([0-9.]+)/);
//                 const load = loadMatch
//                   ? {
//                       load1: parseFloat(loadMatch[1]),
//                       load5: parseFloat(loadMatch[2]),
//                       load15: parseFloat(loadMatch[3]),
//                     }
//                   : null;

//                 // Parse connected users
//                 const users = whoOutput
//                   ? whoOutput.split('\n').filter((line) => line.trim()).map((line) => line.split(' ')[0])
//                   : [];

//                 // Parse traffic speed
//                 const ifstatLines = ifstatOutput.split('\n');
//                 const trafficMatch = ifstatLines[2]?.trim().split(/\s+/);
//                 const traffic: { receivedKbps: number; transmittedKbps: number; } = trafficMatch
//   ? {
//       receivedKbps: parseFloat(trafficMatch[0]),
//       transmittedKbps: parseFloat(trafficMatch[1]),
//     }
//   : { receivedKbps: 0, transmittedKbps: 0 };

//                   resolve({
//                     load: load ?? { load1: 0, load5: 0, load15: 0 },
//                     users,
//                     traffic,
//                   });
//               } catch (err) {
//                 reject(new Error('Failed to parse server metrics'));
//               }
//             });
//         });
//       })
//       .on('error', (err) => reject(err));
//   });
// };

// export const getServerMetricsHandler = async (req: Request, res:Response) => {
//   try {
//     const { serverName } = req.params;

//     // Fetch the server details from the database
//     const server = await Server.findOne({ serverName });
//     if (!server) {
//       return res.status(404).json({ message: 'Server not found' });
//     }

//     // Get server metrics via SSH
//     const metrics = await getServerMetrics(
//       server.ipAddress,
//       22, // Default SSH port
//       server.userName ?? 'root',
//       server.password
//     );

//     res.status(200).json({
//       serverName: server.serverName,
//       location: server.serverLocation,
//       metrics,
//     });
//   } catch (error:any) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch server metrics', error: error.message });
//   }
// };

//endpoint for checking server load function
export const getServerData = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    // Fetch and update server data
    const serverData = await getAndStoreRealTimeData(serverId);
    if (!serverData) {
      return res.status(500).json({ message: "Failed to fetch server data" });
    }

    res.json(serverData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//checking server connection and disconnection

// Function to validate user credentials
const authenticateUser = (username: string, password: string): boolean => {
  const storedUsername = process.env.VPN_USER;
  const storedPassword = process.env.VPN_PASSWORD;
  return username === storedUsername && password === storedPassword;
};

// Helper function to execute shell commands
const executeCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, { shell: os.platform() === "win32" ? undefined : "/bin/bash" }, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing command:", command, error);
        reject(stderr || error.message);
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

//checking bandwidth

// Helper function to get network status
const getNetworkStats = async () => {
  try {
    const networkData = await si.networkStats();
    return networkData;
  } catch (error :any) {
    throw new Error('Error fetching network stats: ' + error.message);
  }
};

// Socket.IO for real-time communication

// Convert bytes to Mbps
const convertBytesToMbps = (bytes: number) => {
  return (bytes * 8) / 1_000_000; 
};


const io = new SocketServer();
let intervalId: NodeJS.Timeout | null = null;

io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null; 
    }
  });
});


export const connectToVPNss = async (req: Request, res: Response) => {
  const { username, password, serverIP, protocol, userId } = req.body;

  // Validate credentials
  if (username !== "root" || password !== "0evAecCGZjqUcWc") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (protocol !== "openvpn" && protocol !== "wireguard") {
    return res.status(400).json({ message: "Unsupported VPN protocol" });
  }

  try {
    const io = getSocketIO();
    const namespace = io.of(`/user/${userId}`);

    const existingUser = await ServerActiveUser.findOne({ userId });

    if (existingUser) {
      await ServerActiveUser.findOneAndUpdate(
        { userId },
        { 
          $set: { 
            userStatus: 'active', 
            serverIP: serverIP 
          }
        },
        { new: true }
      );
    } else {
      const newActiveUser = new ServerActiveUser({ 
        userId, 
        serverIP, 
        userStatus: 'active' 
      });
      await newActiveUser.save();
    }

    namespace.on("connection", (socket) => {
      logger.info(`Client connected to namespace for user: ${userId}`);
      let isConnected = true;

      //Emit bandwidth updates every second
      const interval = setInterval(async () => {
        if (!isConnected) {
          clearInterval(interval);
          return;
        }
    
        try {
          const stats = await getNetworkStats();
          const receivedMbps = convertBytesToMbps(stats[0].rx_bytes).toFixed(2);
          const transmittedMbps = convertBytesToMbps(stats[0].tx_bytes).toFixed(2);
    
          logger.info(`Emitting bandwidth update for user ${userId}:`, {
            receivedMbps,
            transmittedMbps,
          });
    
          // Update the server model's bandwidth stats
          await Server.findOneAndUpdate(
            { ipAddress: serverIP },
            {
              receivedMbps: receivedMbps,
              transmittedMbps: transmittedMbps,
            },
            { new: true }
          );
    
          socket.emit("bandwidthUpdate", { receivedMbps, transmittedMbps });
        } catch (err) {
          logger.error(`Error emitting stats for user ${userId}:`, err);
        }
      }, 1000);

      
      socket.on("disconnect", async () => {
        logger.info(`Client disconnected from namespace for user: ${userId}`);
    
        isConnected = false;
        clearInterval(interval);
    
        try {
          await ServerActiveUser.findOneAndUpdate(
            { userId },
            { $set: { userStatus: 'inactive' } },
            { new: true }
          );
    
          logger.info(`User ${userId} marked as inactive.`);
        } catch (err) {
          logger.error(`Error marking user ${userId} as inactive:`, err);
        }
      });
    });res.status(200).json({
      message: `User ${userId} successfully connected to the VPN server.`,
    });
  } catch (error: any) {
    logger.error("Error in connectToVPN:", error);
    res.status(500).json({ message: "Error connecting to VPN", error: error.message });
  }
};

//disconnect server
export const disconnectedVpn = async (req: Request, res: Response) => {
  const { userId, username, password } = req.body;

  // Validate credentials
  if (!userId || username !== "root" || password !== "0evAecCGZjqUcWc") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const io = getSocketIO();
    const namespace = io.of(`/user/${userId}`);

    // Forcefully disconnect all active sockets for this user
    namespace.disconnectSockets(true);

    // Update user's status to inactive
    const user = await ServerActiveUser.findOneAndUpdate(
      { userId },
      { $set: { userStatus: "inactive" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Platform-specific disconnect command
    const disconnectCommand =
      os.platform() === "linux" || os.platform() === "darwin"
        ? "sudo systemctl stop openvpn@client.service"
        : "taskkill /F /IM openvpn.exe";

    if (os.platform() === "win32") {
      const isProcessRunning = await executeCommand('tasklist | findstr /i "openvpn.exe"')
        .then(() => true)
        .catch(() => false);

      if (!isProcessRunning) {
        console.log("openvpn.exe process not found, no action required.");
        return res.status(200).json({
          message: "User successfully disconnected from the VPN.",
        });
      }
    }

    // Execute the disconnect command
    await executeCommand(disconnectCommand);

    res.status(200).json({
      message: `User ${userId} successfully disconnected from the VPN and marked inactive.`,
    });
  } catch (error: any) {
    console.error("Error disconnecting VPN:", error);

    res.status(500).json({
      message: "Error disconnecting from VPN",
      error: error.message,
    });
  }
};


// export const connectToVPNss= async (req: Request, res: Response) => {
//   const { username, password, serverIP, protocol, userId } = req.body;

//   // Validate credentials
//   if (username !== "root" || password !== "vpnserver123456") {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   if (protocol !== "openvpn" && protocol !== "wireguard") {
//     return res.status(400).json({ message: "Unsupported VPN protocol" });
//   }

//   try {
//     const io = getSocketIO();
//     const namespace = io.of(`/user/${userId}`);

//     const existingUser = await ServerActiveUser.findOne({ userId });

//     if (existingUser) {
//       await ServerActiveUser.findOneAndUpdate(
//         { userId },
//         { 
//           $set: { 
//             userStatus: 'active', 
//             serverIP: serverIP 
//           }
//         },
//         { new: true }
//       );
//     } else {
//       const newActiveUser = new ServerActiveUser({ 
//         userId, 
//         serverIP, 
//         userStatus: 'active' 
//       });
//       await newActiveUser.save();
//     }

//     namespace.on("connection", (socket) => {
//       logger.info(`Client connected to namespace for user: ${userId}`);

//       // Emit bandwidth updates every 5 seconds
//       const interval = setInterval(async () => {
//         try {
//           const stats = await getNetworkStats();
//           const receivedMbps = convertBytesToMbps(stats[0].rx_bytes).toFixed(2);
//           const transmittedMbps = convertBytesToMbps(stats[0].tx_bytes).toFixed(2);

//           logger.info(`Emitting bandwidth update for user ${userId}:`, {
//             receivedMbps,
//             transmittedMbps,
//           });

//           // Update the server model's bandwidth stats
//        await Server.findOneAndUpdate(
//         { ipAddress: serverIP },
//         {
//           receivedMbps: receivedMbps,
//           transmittedMbps: transmittedMbps,
//         },
//         { new: true }
//       );

//           socket.emit("bandwidthUpdate", { receivedMbps, transmittedMbps });
//         } catch (err) {
//           logger.error(`Error emitting stats for user ${userId}:`, err);
//         }
//       }, 1000);

//       socket.on("disconnect", () => {
//         logger.info(`Client disconnected from namespace for user: ${userId}`);
//         clearInterval(interval);
//       });
//     });

//     res.status(200).json({
//       message: `User ${userId} successfully connected to the VPN server.`,
//     });
//   } catch (error: any) {
//     logger.error("Error in connectToVPN:", error);
//     res.status(500).json({ message: "Error connecting to VPN", error: error.message });
//   }
// };




