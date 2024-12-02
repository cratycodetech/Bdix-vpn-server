import { Router } from "express";
import {
  getAllUserCreditRequest,
  createUserCreditRequest,
} from "../controller/userCreditRequest.controller";

const router = Router();

// get all credit request
router.get("/all", getAllUserCreditRequest);

// create new credit request
router.post("/create", createUserCreditRequest);



export default router;
