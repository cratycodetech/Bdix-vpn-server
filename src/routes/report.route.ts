import { Router } from "express";
import {
 
    getAllResellerRequestsIsDone,
    getAllUserReportTable,  
} from "../controller/report.controller";

const router = Router();

//report api for user table 
//get all users info for report table 
router.get("/user/all", getAllUserReportTable);

//report api
// get all Reseller info for report table
router.get('/reseller/all', getAllResellerRequestsIsDone);

export default router;

