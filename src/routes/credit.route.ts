import { Router } from "express";
import { 
    addCredits, 
    getAllCredit ,
    getAllRequests,
    getMonthlyCreditSummary,
    countPendingRequestCredits,
    transferCreditToReseller,
    getAllCreditHistories,
    getTotalCredit} from "../controller/credit.controller";

const router = Router();

//get all credits
router.get("/all", getAllCredit);

//get all credit request
router.get("/all-request", getAllRequests); //for table

//get count all pending credit request
router.get("/pending-request-count", countPendingRequestCredits);

//get total credit 
router.get("/total-credit", getTotalCredit);

//get total  transfer credit in monthly
router.get("/credit-summary", getMonthlyCreditSummary);

//add or generate Credit
router.post("/add", addCredits);

// get all  generated credit history
router.get("/history", getAllCreditHistories);

// create transfer Credit to reseller
router.post("/credit-transfer", transferCreditToReseller);

// update credit
// router.patch("/update/:id", updateCredit);

// //delete credit
// router.delete("/delete/:id", deleteCredit);

export default router;
