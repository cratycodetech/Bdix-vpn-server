import { Router } from "express";
import {
  deleteUser,
  getAdmin,
  getAllUsers,
  getReseller,
  getSingleUser,
  updateUser,
  updateUserRole,
} from "../controller/user.controller";

const router = Router();

// get all users
router.get("/all", getAllUsers);

// get single user
router.get("/single/:id", getSingleUser);

// get admin
router.get("/admin/:email", getAdmin);

// get reseller
router.get("/reseller/:email", getReseller);

// update user
router.put("/update-profile/:id", updateUser);

// update user role
router.patch("/change-role/:id", updateUserRole);

//update premium user
router.patch("/update-premium/:id", updateUserRole);

//delete user
router.delete("/delete/:id", deleteUser);

export default router;
