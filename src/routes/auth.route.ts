import { Router } from "express";

import {
  logout,
  resetPassword,
  signup,
  login,
  sendOtpBeforeSignup,
  verifyOTP,
  requestPasswordReset,
  resetPasswords,
} from "../controller/auth.controller";

const router = Router();

//signup
router.post("/signup", signup);

//login
router.post("/login", login);

//logout
router.delete("/logout", logout);

// forgot password
//router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password", resetPassword);

// Route to send OTP
router.post('/send-otp', sendOtpBeforeSignup);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

//checking reset password

// Route to send link
router.post('/send-link', requestPasswordReset);

// Route to verify OTP
router.post('/verify-pass', resetPasswords);

export default router;
