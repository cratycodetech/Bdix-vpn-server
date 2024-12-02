import { Router } from "express";
import {
  getCountAllUsers,
  getCountAllPremiumUsers,
  getCountNormalUsers,
} from "../controller/resellerDashboard.controller";

const router = Router();

// get count all user
router.get("/count-user", getCountAllUsers);

// get count all premium user
router.get("/count-premiumUser", getCountAllPremiumUsers);

// get count all normal user
router.get("/count-normalUser", getCountNormalUsers);

// get single reseller available credits
router.get("/single/:id", getCountNormalUsers);



export default router;
