import { Router } from "express";

import { getSubscriptionStats } from "../controller/subscriptionUser.controller";

const router = Router();
// Route to get subscription stats
router.get("/count", getSubscriptionStats);


export default router;
