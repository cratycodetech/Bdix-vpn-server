import { NextFunction, Request, Response } from "express";
import UserCreditRequest from "../model/userCreditRequest.model";
import RequestModel from "../model/request.model";
import User from "../model/user.model";



//get all user credit request
export const getAllUserReportTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const creditRequests = await UserCreditRequest.find({ status: "done" })
      .populate("userId", "name")
      .populate("resellerId", "name"); 

    const formattedData = creditRequests.map((request) => {
      const userName =
        request.userId &&
        typeof request.userId === "object" &&
        "name" in request.userId
          ? (request.userId as { name: string }).name
          : "Unknown";

      const resellerName =
        request.resellerId &&
        typeof request.resellerId === "object" &&
        "name" in request.resellerId
          ? (request.resellerId as { name: string }).name
          : "Unknown";

      return {
        id: request._id,
        userName,
        resellerName,
        creditAmount: request.creditAmount,
        paymentMethod: request.paymentMethod,
        moneyAmount: request.MoneyAmount,
        requestTo: request.requestTo,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Get all user report table info",
      count: formattedData.length,
      data: formattedData,
    });
    } catch (error) {
        next(error);
    }
};
  //get all credit requests(request to reseller to admin)
  export const getAllResellerRequestsIsDone = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const requests = await RequestModel.find({ status: "done" });

        // Map through requests and fetch reseller details
        const formattedData = await Promise.all(
          requests.map(async (request) => {
            // Fetch the reseller from the User model using the resellerId
            const reseller = await User.findById(request.resellerId);
    
            return {
              id: request._id,
              transactionId: request.transactionId,
              paymentMethod: request.paymentMethod,
              moneyAmount: request.MoneyAmount,
              creditAmount: request.creditAmount,
              status: request.status,
              resellerId: request.resellerId,
              resellerName: reseller ? reseller.name : "Unknown", // Check if reseller exists and get the name
              createdAt: request.createdAt,
              updatedAt: request.updatedAt,
            };
          })
        );
    
        return res.status(200).json({
          success: true,
          message: "Get all resellers with status 'done' successfully",
          count: formattedData.length,
          data: formattedData,
        });
    } catch (error) {
      next(error)
    }
  };
    
  