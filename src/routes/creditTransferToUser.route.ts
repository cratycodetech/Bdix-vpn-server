import { Router } from "express";
import {
  transferCreditToUser,
  getAllUserCreditRequest
} from "../controller/creditTransferToUser.controller";

const router = Router();

// transfer credit to user
router.post("/request-user", transferCreditToUser);

//get all users
router.get("/all", getAllUserCreditRequest);



export default router;