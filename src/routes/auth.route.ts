import { Router } from "express";

import {
  logout,
  adminSignup,
  adminLogin,
  resetPassword,
} from "../controller/auth.controller";

const router = Router();

// admin signup
router.post("/admin/signup", adminSignup);

// admin login
router.post("/admin/login", adminLogin);

//admin logout
router.delete("/logout", logout);

// forgot password
//router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password", resetPassword);

export default router;
