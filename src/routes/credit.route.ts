import { Router } from "express";
import { 
    addCredit, 
    getAllCredit ,
    createCreditRequest, 
    getAllRequests,
    addCreditHistory,
    getMonthlyCreditSummary,
    countPendingRequestCredits,
    transferCreditToReseller,
    getAllCreditHistories} from "../controller/credit.controller";

const router = Router();

//get all credits
router.get("/all", getAllCredit);

//get all credit request
router.get("/all-request", getAllRequests);

//get count all pending credit request
router.get("/pending-request-count", countPendingRequestCredits);

//get total credit 
router.get("/total-credit", getAllRequests);

//get total credit summary monthly
router.get("/credit-summary", getMonthlyCreditSummary);

// // get single credit
// router.get("/single/:id", getSingleCredit);

// create new Credit
router.post("/add", addCredit);

// generate Credit
router.post("/generate", addCreditHistory);

// get all credit history
router.get("/history", getAllCreditHistories);


// create new Credit request
router.post("/credit-request", createCreditRequest);

// create transfer Credit to reseller
router.post("/credit-transfer", transferCreditToReseller);

// update credit
// router.patch("/update/:id", updateCredit);

// //delete credit
// router.delete("/delete/:id", deleteCredit);

export default router;
