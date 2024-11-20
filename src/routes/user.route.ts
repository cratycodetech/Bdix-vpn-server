import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserRole,
} from "../controller/user.controller";

const router = Router();

// get all users
router.get("/all", getAllUsers);

// get single user
router.get("/single/:id", getSingleUser);

// update user
router.put("/update-profile/:id", updateUser);

// update user role
router.patch("/change-role/:id", updateUserRole);

//delete user
router.delete("/delete/:id", deleteUser);

export default router;
