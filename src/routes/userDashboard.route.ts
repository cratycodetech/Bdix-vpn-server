import { Router } from "express";
import {
  
    filterByEmail,
    filterByResellerReference,
    filterBySubscriptionStatus,
    filterByUserId,
    getAllPremiumUsers
} from "../controller/userDashboard.controller";

const router = Router();

// get all premium users
router.get("/all", getAllPremiumUsers);

// get all premium users filter by userId
router.get("/filter/user/:userId", filterByUserId);

// get all premium users filter by email
router.get("/filter/email", filterByEmail);

// get all premium users filter by subscription status
router.get("/filter/subscription-status", filterBySubscriptionStatus);

// get all premium users filter by reseller reference
router.get("/filter/reseller-reference", filterByResellerReference);



export default router;
