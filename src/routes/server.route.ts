import { Router } from "express";
import {
 // checkVpnStatus,
  // connectToVPNs,
  //connectToVPN,
  createServer,
  deleteServer,
  getAllServers,
  getAllServerStatus,
  getCountActiveServer,
  getSingleServer,
  //disconnectedVpn,
  //disconnectVPNHandler,
  getServerData,
  updateServer,
  updateServerStatus,
  checkVpnStatus,
  getActiveUsers,
  disconnectedVpn,
  connectToVPNss,
  // fetchServerLoad,
  //getActiveUsers,
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

//get server load data
router.get("/realtime/:serverId", getServerData);
//checking vpn connection
// Route to connect to the VPN
router.post('/connect', connectToVPNss);

// Route to check VPN connection status
 router.get('/status', checkVpnStatus);

// Route to disconnect from the VPN
router.post('/disconnect', disconnectedVpn);

// Define route to get active users
 router.get('/active-users', getActiveUsers);

export default router;
