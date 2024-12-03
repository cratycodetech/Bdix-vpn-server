import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import Reseller from "../model/reseller.model";
import PremiumUser from "../model/PremiumUser.model";
import RequestModel from "../model/request.model";


//get all credit requests(request to reseller to admin)
export const getAllRequests = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const requests = await RequestModel.find().sort({ createdAt: -1 }); ; 
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error)
  }
};


// Create a new credit request
export const createCreditRequest = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const { transactionId, resellerId,  creditAmount } = req.body;
  
      if (!transactionId || !resellerId || !creditAmount) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      const newRequest = await RequestModel.create(
       req.body
      );
  
      const savedRequest = await newRequest.save();
  
      res.status(201).json({ message: "Request created successfully", data: savedRequest });
    } catch (error: any) {
      next(error)
    }
  };
  
