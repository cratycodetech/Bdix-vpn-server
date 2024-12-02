import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import PremiumUser from "../model/PremiumUser.model";
import Reseller from "../model/reseller.model";


// get  count all users
export const getCountAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const userCount = await User.countDocuments({ role: "User" });
  
      res.status(200).json({
        message: "all users count get successfully",
        data: userCount,
      });
    } catch (err: any) {
      next(err)
    }
  };


  // get  count all premium users
export const getCountAllPremiumUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const premiumUser = await PremiumUser.countDocuments({ userType: "Premium" });
  
      res.status(200).json({
        message: "get count premium users successfully",
        data: premiumUser,
      });
    } catch (err: any) {
      next(err)
    }
  };

  // get  count all normal users
export const getCountNormalUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const userCount = await PremiumUser.countDocuments({ userType: "Free" });
  
      res.status(200).json({
        message: "all users count get successfully",
        data: userCount,
      });
    } catch (err: any) {
      next(err)
    }
  };


  // get  count all normal users
  export const getSingleResellerAvailableCredit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; 
      
      const reseller = await Reseller.findOne({ resellerId: id }).select('totalCredit');
    
      if (!reseller) {
        return res.status(404).json({ message: 'Reseller not found' });
      }
  
      return res.status(200).json({ totalCredit: reseller.totalCredit });
    } catch (err: any) {
      next(err)
    }
  };  