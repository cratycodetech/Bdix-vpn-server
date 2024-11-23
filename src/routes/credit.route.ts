import { Router } from "express";
import { addCredit, getAllCredit ,createCreditRequest, getAllCreditRequest, getCountAllCreditRequest} from "../controller/credit.controller";
import { getCountActiveServer } from "../controller/server.controller";

const router = Router();

//get all credits
router.get("/all", getAllCredit);

//get all credit request
router.get("/all-request", getAllCreditRequest);

//get count all credit request
router.get("/count-request", getCountAllCreditRequest);

// // get single credit
// router.get("/single/:id", getSingleCredit);

// create new Credit
router.post("/add", addCredit);

// create new Credit request
router.post("/credit-request", createCreditRequest);


// update credit
// router.patch("/update/:id", updateCredit);

// //delete credit
// router.delete("/delete/:id", deleteCredit);

export default router;
