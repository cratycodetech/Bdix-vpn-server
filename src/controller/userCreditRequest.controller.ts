import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import PremiumUser from "../model/PremiumUser.model";
import UserCreditRequest from "../model/userCreditRequest.model";


// create credit request
export const createUserCreditRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
  
        if (Object.keys(data).length === 0) {
          throw new Error("Data can't be empty")
        }
    
        const userCreditRequest = await UserCreditRequest.create(data);
    
        res.status(201).json({
          message: "User credit request created Successfully",
          data: userCreditRequest,
        });
    } catch (err: any) {
      next(err)
    }
  };

  // get all credit request
export const getAllUserCreditRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
     const userCreditRequests = await UserCreditRequest.find();
  
      res.status(200).json({
        message: "get all credit request successfully",
        data: userCreditRequests,
      });
    } catch (err: any) {
      next(err)
    }
  };


