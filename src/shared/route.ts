import { Router } from "express";
import authRoutes from "./../routes/auth.route";
import serverRoutes from "./../routes/server.route";
import creditRoutes from "./../routes/credit.route";
import userRoutes from "./../routes/user.route";
import premiumUserRoutes from "./../routes/premiumUser.route";
import resellerRoutes from "./../routes/reseller.route";
import resellerDashboardRoutes from "./../routes/resellerDashboard.route";
import userDashboardRoutes from "./../routes/userDashboard.route";
import userCreditRequestRoutes from "./../routes/userCreditRequest.route";
import creditTransferToUserRoutes from "./../routes/creditTransferToUser.route"; 
import requestRoutes from "../routes/request.route"; 
import serverActiveUserRoutes from "../routes/serverActiveUser.route"; 
import historyRoutes from "../routes/history.route"; 
import subscriptionRoutes from "../routes/subscriptionUser.route"; 
import guestUserRoutes from "../routes/guestUser.route"; 
import reportRoutes from "../routes/report.route"; 

// import paymentRoutes from "../routes/payment.route"; 







const router = Router();

// Root route
router.get("/", (_, res) => {
  res.send("App Working successfully");
});

// general Routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/premium-user", premiumUserRoutes);
router.use("/server", serverRoutes);
router.use("/credit", creditRoutes);
router.use("/request", requestRoutes);
router.use("/reseller", resellerRoutes);
router.use("/reseller-dashboard", resellerDashboardRoutes);
router.use("/user-dashboard", userDashboardRoutes);
router.use("/user-credit-request", userCreditRequestRoutes);
router.use("/transfer-credit-to-user", creditTransferToUserRoutes);
router.use("/server-active-user", serverActiveUserRoutes);
router.use("/history", historyRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/guest", guestUserRoutes);
router.use("/report", reportRoutes);

// router.use("/payment", paymentRoutes);




// Handle not found
router.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default router;
