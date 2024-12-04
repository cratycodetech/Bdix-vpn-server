import { Router } from "express";
import {
  checkVpnStatus,
  connectToVPNs,
  createServer,
  deleteServer,
  getAllServers,
  getAllServerStatus,
  getCountActiveServer,
  getSingleServer,
  disconnectedVpn,
  updateServer,
  updateServerStatus,
  getActiveUsers,
} from "../controller/server.controller";

const router = Router();

// get all servers
router.get("/all", getAllServers);

// get single server
router.get("/single/:id", getSingleServer);

//get all server filter by status
router.get("/single/:status", getAllServerStatus);

//get count active server 
router.get("/count", getCountActiveServer);

// create new server
router.post("/create",createServer);

// update server
router.put("/update-profile/:id", updateServer);

// update servers status
router.patch("/change-status/:id", updateServerStatus);

//delete user
router.delete("/delete/:id", deleteServer);

//checking vpn connection
// Route to connect to the VPN
router.post('/connect', connectToVPNs);

// Route to check VPN connection status
router.get('/status', checkVpnStatus);

// Route to disconnect from the VPN
router.post('/disconnect', disconnectedVpn);

// Define route to get active users
router.get('/active-users', getActiveUsers);

export default router;
