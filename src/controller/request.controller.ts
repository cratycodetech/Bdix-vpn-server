import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import Reseller from "../model/reseller.model";
import PremiumUser from "../model/PremiumUser.model";
import RequestModel from "../model/request.model";


// Controller to get all requests
export const getAllRequests = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const requests = await RequestModel.find(); 
    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error)
  }
};
