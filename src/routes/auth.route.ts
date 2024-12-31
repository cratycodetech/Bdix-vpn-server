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
  sendOtpForgetPassword ,
  resetPasswordForApp
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

// reset password fot web
router.post("/reset-password", resetPassword);

// Route to verify OTP
router.post('/verify-otp', verifyOTP);

//essential route for app

// Route to send OTP before signup for app
router.post('/send-otp', sendOtpBeforeSignup);

// Route to send OTP before forget password for app
router.post('/forget-password', sendOtpForgetPassword);

// reset password fot app
router.post("/reset-password-app", resetPasswordForApp);

//checking reset password

// Route to send link
router.post('/send-link', requestPasswordReset);

// Route to verify OTP
router.post('/verify-pass', resetPasswords);

export default router;
