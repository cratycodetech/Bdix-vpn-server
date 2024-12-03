import { Router } from "express";
import {
  transferCreditToUser
} from "../controller/creditTransferToUser.controller";

const router = Router();

// transfer credit to user
router.post("/request-user", transferCreditToUser);



export default router;