import { Router } from "express";
import {
  createServer,
  deleteServer,
  getAllServers,
  getAllServerStatus,
  getCountActiveServer,
  getSingleServer,
  updateServer,
  updateServerStatus,
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

export default router;
