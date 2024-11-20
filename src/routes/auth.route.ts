import { Router } from "express";

import {
  logout,
  resetPassword,
  signup,
  login,
  sendOTP,
  verifyOTP,
} from "../controller/auth.controller";

const router = Router();

//signup
router.post("/signup", signup);

//login
router.post("/login", login);

//admin logout
router.delete("/logout", logout);

// forgot password
//router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password", resetPassword);

// Route to send OTP
router.post('/send-otp', sendOTP);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

export default router;
