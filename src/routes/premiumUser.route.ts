import { Router } from "express";
import { 
  createPremiumUser, 
  deletePremiumUser, 
  getAllPremiumUsers, 
  getSinglePremiumUser,
  getPremiumUserFilterByEmail, 
  getPremiumUserFilterBySubscriptionStatus,
  getPremiumUserFilterByResellerReference,
  updateSubscriptionStatus,
  updatePremiumUser } from "../controller/premiumUser.controller";

const router = Router();

// get all premium users
router.get("/all", getAllPremiumUsers);

// get single premium user
router.get("/single/:id", getSinglePremiumUser);

// get premium user filter by email
router.get("/email", getPremiumUserFilterByEmail);

// get premium user filter by subscriptionStatus
router.get("/status", getPremiumUserFilterBySubscriptionStatus);

// get premium user filter by resellerReference
router.get("/reseller-reference",  getPremiumUserFilterByResellerReference);

// create premium user
router.post("/create", createPremiumUser);

// update premium user
router.put("/update/:id", updatePremiumUser);

// update subscription status premium user
router.put("/update/:id", updateSubscriptionStatus);

//delete user
router.delete("/delete/:id", deletePremiumUser);

export default router;
