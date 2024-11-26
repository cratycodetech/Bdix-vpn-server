import { Router } from "express";
import { 
  createPremiumUser, 
  deletePremiumUser, 
  getAllPremiumUsers, 
  getSinglePremiumUser, 
  updatePremiumUser } from "../controller/premiumUser.controller";

const router = Router();

// get all premium users
router.get("/all", getAllPremiumUsers);

// get single premium user
router.get("/single/:id", getSinglePremiumUser);

// create premium user
router.post("/create", createPremiumUser);

// update premium user
router.put("/update/:id", updatePremiumUser);

//delete user
router.delete("/delete/:id", deletePremiumUser);

export default router;
