import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import PremiumUser from "../model/PremiumUser.model";


// get all premium users
export const getAllPremiumUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const premiumUsers = await PremiumUser.find()

    res.status(200).json({
      message: " premium users get successfully",
      data: premiumUsers,
    });
  } catch (err: any) {
    next(err)
  }
};

// get single premium user
export const getSinglePremiumUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const premiumUser = await PremiumUser.findById(req.params.id).populate("UserId");
    if (!premiumUser) {
      return res.status(404).json({ success: false, message: "Premium User not found" });
    }
    res.status(200).json({ 
      success: true,
      message: "Premium user get successfully", 
      data: premiumUser });
  } catch (err: any) {
    next(err)
  }
};

// create new premium  user
export const createPremiumUser  = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;

    if (Object.keys(data).length === 0) {
      throw new Error("Data can't be empty")
    }

    const server = await PremiumUser.create(data);

    res.status(201).json({
      message: "Premium user created Successfully",
      data: server,
    });
  } catch (err: any) {
    next(err)
  }
};

// update premium user 
export const updatePremiumUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found")
    }

    const updatedUser = await PremiumUser.findByIdAndUpdate(userId, req.body);

    res.status(200).json({
      message: "premium user updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    next(err)
  }
};

// delete premium user
export const deletePremiumUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await PremiumUser.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new Error("User not found")
    }

    res.status(200).json({
      message: "premium user Deleted Successfully",
    });
  } catch (err: any) {
    next(err)
  }
};

