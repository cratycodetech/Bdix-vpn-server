import { NextFunction, Request, Response } from "express";
import Server from "./../model/server.model";
import { exec } from 'child_process';  // For executing shell commands like ping or VPN control commands
import dotenv from 'dotenv';
import { pingServer } from "../utils/ping-server";
import * as os from 'os'; 
import ServerActiveUser from "../model/serverAssignmentModel";
dotenv.config();
import si from 'systeminformation';

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


//disconnect vpn
export const disconnectedVpn = async (req: Request, res: Response) => {
  const { userId, username, password } = req.body;

  if (!userId || username !== "root" || password !== "vpnserver123456") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const user = await ServerActiveUser.findOneAndUpdate(
      { userId },
      { $set: { userStatus: "inactive" } },
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //console.log("User updated:", user);

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

    //console.log("Executing disconnect command:", disconnectCommand);
    const commandOutput = await executeCommand(disconnectCommand);

    return res.status(200).json({
      message: "User successfully disconnected from the VPN.",
    });
  } catch (error: any) {
    console.error("Error disconnecting VPN:", error);

    return res.status(500).json({
      message: "Error disconnecting from VPN",
      error: error.message,
    });
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

//checking bandwidth

// Helper function to get network stats
const getNetworkStats = async () => {
  try {
    const networkData = await si.networkStats();
    return networkData;
  } catch (error :any) {
    throw new Error('Error fetching network stats: ' + error.message);
  }
};

// Convert bytes to Mbps
const convertBytesToMbps = (bytes: number) => {
  return (bytes * 8) / 1_000_000; 
};

// Main endpoint to connect to the VPN and return bandwidth status
export const connectToVPNs = async (req: Request, res: Response) => {
  const { username, password, serverIP, protocol, userId } = req.body;

  // Validate the credentials
  if (username !== 'root' || password !== 'vpnserver123456') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (protocol !== 'openvpn' && protocol !== 'wireguard') {
    return res.status(400).json({ message: 'Unsupported VPN protocol' });
  }

  try {
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

    const currentStats = await getNetworkStats();

    if (currentStats.length) {
      const stats = currentStats[0]; 
      const receivedMbps = convertBytesToMbps(stats.rx_bytes);
      const transmittedMbps = convertBytesToMbps(stats.tx_bytes);

       // Update the server model's bandwidth stats
       await Server.findOneAndUpdate(
        { ipAddress: serverIP },
        {
          receivedMbps: receivedMbps.toFixed(2),
          transmittedMbps: transmittedMbps.toFixed(2),
        },
        { new: true }
      );

      return res.status(200).json({
        message: `User ${userId} successfully connected to the VPN server.`,
        currentBandwidth: {
          receivedMbps: receivedMbps.toFixed(2),  
          transmittedMbps: transmittedMbps.toFixed(2)  
        },
      });
    } else {
      return res.status(500).json({ message: 'No network stats available.' });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Error connecting to VPN', error: error.message });
  }
};




//connection to the VPN
// export const connectToVPNs = async (req: Request, res: Response,next: NextFunction) => {
//   const { username, password, serverIP, protocol } = req.body;

//   if (username !== 'root' || password !== 'vpnserver123456') {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   if (protocol !== 'openvpn' && protocol !== 'wireguard') {
//     return res.status(400).json({ message: 'Unsupported VPN protocol' });
//   }

//   try {
//     const isServerReachable = await pingServer(serverIP);

//     if (!isServerReachable) {
//       return res.status(500).json({ message: 'Failed to connect to the VPN server' });
//     }

//     return res.status(200).json({ message: 'Successfully connected to the VPN server' });
//   } catch (error:any) {
//     next(error)
//   }
// };

// const VPN_SERVER_IP = process.env.VPN_SERVER_IP || '5.161.52.6'; 

// // get VPN Server Status
// export const checkVpnStatus = async (req: Request, res: Response) => {
//   exec(`ping -c 4 ${VPN_SERVER_IP}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error pinging server: ${error.message}`);
//       return res.status(500).json({ message: 'Failed to connect to the VPN server', error: error.message });
//     }
//     if (stderr) {
//       console.error(`Ping error: ${stderr}`);
//       return res.status(500).json({ message: 'Failed to connect to the VPN server', error: stderr });
//     }

//     console.log(`Ping success: ${stdout}`);
//     return res.status(200).json({ message: 'VPN is connected', status: 'online', result: stdout });
//   });
// };

// // disconnecting from the VPN
// export const disconnectedVpn = async (req: Request, res: Response) => {
//   const { username, password } = req.body;

//   if (username !== 'root' || password !== 'vpnserver123456') {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   try {
//    exec('sudo systemctl stop openvpn@client.service', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error disconnecting VPN: ${error.message}`);
//       return res.status(500).json({ message: 'Failed to disconnect from the VPN server', error: error.message });
//     }
//     if (stderr) {
//       console.error(`Disconnection error: ${stderr}`);
//       return res.status(500).json({ message: 'Failed to disconnect from the VPN server', error: stderr });
//     }

//     console.log(`VPN disconnected: ${stdout}`);
//     return res.status(200).json({ message: 'VPN disconnected successfully', details: stdout });
//   });
//   } catch (err:any) {
//     return res.status(500).json({ message: 'Error disconnecting from VPN', error: err.message });
//   }
// };



// // find active user from the VPN
// export const getActiveUsers  = async (req: Request, res: Response) => {

//   try {
//    // Run the `who` command to get active users
//   exec('who', (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error executing command: ${error.message}`);
//       return res.status(500).json({ message: 'Error fetching active users', error: error.message });
//     }

//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return res.status(500).json({ message: 'Error fetching active users', error: stderr });
//     }

//     // Parse the output and return a structured response
//     const activeUsers = stdout.split('\n').map(line => {
//       const [user, terminal, date, time, address] = line.split(/\s+/);
//       return { user, terminal, date, time, address };
//     }).filter(user => user.user); // Filter out any empty lines

//     return res.status(200).json({
//       message: 'Active users fetched successfully',
//       users: activeUsers
//     });
//   });
//   } catch (err:any) {
//     return res.status(500).json({ message: 'Error disconnecting from VPN', error: err.message });
//   }
// };



