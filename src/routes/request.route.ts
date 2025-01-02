import { Router } from "express";
import {
    getAllRequests,
    createCreditRequest, 
    getAllResellerRequestsIsDone
} from "../controller/request.controller";

const router = Router();

// get all credit requests (request to reseller to admin) 
router.get('/all', getAllRequests);

// create new Credit request
router.post("/create", createCreditRequest);

//report api
// get all Reseller info
router.get('/report', getAllResellerRequestsIsDone);


export default router;
