import { Router } from "express";
import {
  
    filterByEmail,
    getAllUsers,
    getAllNormalUsers,
    filterByResellerReference,
    filterBySubscriptionStatus,
    filterByUserId,
    getAllPremiumUsers
} from "../controller/userDashboard.controller";

const router = Router();

// get all users
router.get("/all", getAllUsers);

// get all normal users
router.get("/all/normal", getAllNormalUsers);

// get all premium users
router.get("/all/premium", getAllPremiumUsers);

// get all premium users filter by userId
router.get("/all/:userId", filterByUserId);

// get all premium users filter by email
router.get("all/email", filterByEmail);

// get all premium users filter by subscription status
router.get("/all/subscription-status", filterBySubscriptionStatus);

// get all premium users filter by reseller reference
router.get("/all/reseller-reference", filterByResellerReference);

export default router;
