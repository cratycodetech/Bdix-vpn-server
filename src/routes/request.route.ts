import { Router } from "express";
import {
    getAllRequests,
    createCreditRequest, 
} from "../controller/request.controller";

const router = Router();

// get all credit requests (request to reseller to admin) 
router.get('/all', getAllRequests);

// create new Credit request
router.post("/create", createCreditRequest);


export default router;
