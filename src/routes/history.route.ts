import { Router } from "express";

import { getSubscribedUsersByMonth ,getCurrentMonthTransferHistory, getMonthlyLogins} from "../controller/history.controller";


const router = Router();

// get all transfer history for a specific month
router.get("/transfer-history",getCurrentMonthTransferHistory);

// get all login users for a specific month
router.get("/login-users/monthly",getMonthlyLogins);

// get all subscribed users for a specific month
router.get("/subscribed-users/monthly", getSubscribedUsersByMonth);



export default router;