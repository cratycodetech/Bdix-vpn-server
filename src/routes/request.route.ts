import { Router } from "express";
import {
    getAllRequests,
} from "../controller/request.controller";

const router = Router();

// Define the route for fetching all requests
router.get('/all', getAllRequests);


export default router;
