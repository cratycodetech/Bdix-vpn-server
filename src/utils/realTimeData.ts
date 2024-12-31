
import Server from "../model/server.model";
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH(); // Correct usage


export const getAndStoreRealTimeData = async (serverId: string) => {
  try {
    // Find the server by ID
    const server = await Server.findById(serverId);
    if (!server) {
      throw new Error("Server not found");
    }

    // Connect to the server via SSH
    await ssh.connect({
      host: server.ipAddress,
      username: server.userName || "root", 
      password: server.password,
    });

    // Execute commands to fetch traffic and connected user data
    const trafficData = await ssh.execCommand('vnstat --json');
    const connectedUsers = await ssh.execCommand('who | wc -l');
    const speed = Math.random() * 100; // Simulated speed (replace with actual command if available)

    // Parse traffic data
    const parsedTrafficData = JSON.parse(trafficData.stdout || '{}');
    const receivedMbps = parsedTrafficData.rx || 0;
    const transmittedMbps = parsedTrafficData.tx || 0;

    // Update the server document in the database
    server.receivedMbps = receivedMbps;
    server.transmittedMbps = transmittedMbps;
    server.connectedUsers = parseInt(connectedUsers.stdout || '0', 10);
    server.lastUpdated = new Date();

    await server.save();

    ssh.dispose();

    return {
      serverName: server.serverName,
      ipAddress: server.ipAddress,
      receivedMbps,
      transmittedMbps,
      connectedUsers: server.connectedUsers,
      speed: `${speed.toFixed(2)} Mbps`,
    };
  } catch (error) {
    console.error("Error fetching server data:", error);
    return null;
  }
};
