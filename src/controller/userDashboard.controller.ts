import { Request, Response, NextFunction } from "express";
import User from "./../model/user.model";
import PremiumUser from "../model/PremiumUser.model";

  // get all premium users
  export const getAllPremiumUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const premiumUser = await PremiumUser.countDocuments({ userType: "Premium" }).populate({
        path: "userId",
        select: "email name", 
      })
      .exec();;
  
      res.status(200).json({
        message: "get count premium users successfully",
        data: premiumUser,
      });
    } catch (err: any) {
      next(err)
    }
  };


// Filter by userId
export const filterByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const premiumUsers = await PremiumUser.find({ userId })
        .populate("userId", "email name")
        .exec();
      res.status(200).json(premiumUsers);
    } catch (error) {
      console.error("Error filtering by userId:", error);
      res.status(500).json({ error: "Failed to filter by userId." });
    }
  };
  
  // Filter by email
  export const filterByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      const premiumUsers = await PremiumUser.find()
        .populate({
          path: "userId",
          match: { email }, 
          select: "email name",
        })
        .exec();
  
      const filtered = premiumUsers.filter((user) => user.userId !== null);
      res.status(200).json(filtered);
    } catch (error) {
      console.error("Error filtering by email:", error);
      res.status(500).json({ error: "Failed to filter by email." });
    }
  };
  
  // Filter by subscription status
  export const filterBySubscriptionStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const premiumUsers = await PremiumUser.find({ subscriptionStatus: status })
        .populate("userId", "email name")
        .exec();
      res.status(200).json(premiumUsers);
    } catch (error) {
      console.error("Error filtering by subscription status:", error);
      res.status(500).json({ error: "Failed to filter by subscription status." });
    }
  };
  
  // Filter by reseller reference
  export const filterByResellerReference = async (req: Request, res: Response) => {
    try {
      const { resellerReference } = req.query;
      const premiumUsers = await PremiumUser.find({ resellerReference })
        .populate("userId", "email name")
        .exec();
      res.status(200).json(premiumUsers);
    } catch (error) {
      console.error("Error filtering by reseller reference:", error);
      res.status(500).json({ error: "Failed to filter by reseller reference." });
    }
  };
