import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import PremiumUser from "../model/PremiumUser.model";
import UserCreditRequest from "../model/userCreditRequest.model";
import Reseller from "../model/reseller.model";
import CreditTransferToUserHistory from "../model/creditTransferToUserHistory.model"; 
import { console } from "inspector";


// transfer credit to user
export const transferCreditToUser = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    const creditRequest = await UserCreditRequest.findById({ _id: requestId });
    if (!creditRequest) {
      return res.status(404).json({ message: "Credit request not found" });
    }

    if (creditRequest.status !== "pending") {
      return res.status(400).json({ message: "Credit request already processed" });
    }

    const { resellerId, creditAmount, userId } = creditRequest;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID or not found" });
    }

    if (!resellerId) {
      return res.status(400).json({ message: "Invalid reseller ID or not found" });
    }

    const uId = userId.toString();
    const reId = resellerId.toString();

    console.log(uId, reId);

    const reseller = await Reseller.findOne({ resellerId: reId });
    if (!reseller) {
      return res.status(404).json({ message: "Reseller not found" });
    }

    const premiumUser = await PremiumUser.findOne({ userId: uId, resellerReference: reId });

    console.log(premiumUser);
    if (!premiumUser) {
      return res.status(404).json({ message: "Premium user not found" });
    }

    // Check if the reseller has enough available credit
    if (reseller.availableCredit < creditRequest.creditAmount) {
      return res.status(400).json({ message: 'Insufficient credit balance' });
    }

    // Transfer credit to reseller
    reseller.availableCredit = (reseller.availableCredit || 0) - creditAmount;
    reseller.transferCredit = (reseller.transferCredit || 0) + creditAmount;
    await reseller.save();

    // Update the user's credit
    premiumUser.credits += creditRequest.creditAmount;
    await premiumUser.save();

    // Update the credit request status to 'done'
    creditRequest.status = 'done';
    await creditRequest.save();

    // Add transfer history entry
    await CreditTransferToUserHistory.create({
      userId: uId,
      resellerId: reId,
      creditAmount: creditAmount,
      transactionType: "creditTransfer",
      transactionDate: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Credit transferred successfully",
      data: {
        reseller,
        creditRequest,
        remainingCredit: reseller.availableCredit,
      },
    });
  } catch (error) {
    console.error("Error transferring credit:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while transferring credit",
    });
  }
};





















// export const transferCreditToUser = async (req: Request, res: Response) => {
//     try {
//       const { requestId } = req.body;
  
//       const creditRequest = await UserCreditRequest.findById({ _id: requestId });
//       if (!creditRequest) {
//         return res.status(404).json({ message: "Credit request not found" });
//       }
  
//       if (creditRequest.status !== "pending") {
//         return res.status(400).json({ message: "Credit request already processed" });
//       }
  
//       const { resellerId, creditAmount,userId } = creditRequest;
  
//       if (!userId) {
//         return res.status(400).json({ message: "Invalid user ID or not found" });
//       }

//       if (!resellerId) {
//         return res.status(400).json({ message: "Invalid reseller ID or not found" });
//       }
  
//       const uId = userId.toString();
//       const reId = resellerId.toString();
  
//       const reseller = await Reseller.findOne({ resellerId: reId });
//       if (!reseller) {
//         return res.status(404).json({ message: "Reseller not found" });
//       }
  
//       const premiumUser = await PremiumUser.findOne({ userId: uId, resellerReference: reId });
//       if (!premiumUser) {
//         return res.status(404).json({ message: "Premium user not found" });
//       }
      
//      // Check if the reseller has enough available credit
//     if (reseller.availableCredit < creditRequest.creditAmount) {
//         return res.status(400).json({ message: 'Insufficient credit balance' });
//       }
  
//       // Transfer credit to reseller
//     reseller.availableCredit = (reseller.availableCredit || 0) - creditAmount;
//     await reseller.save();

//       // Update the user's credit
//     premiumUser.credits += creditRequest.creditAmount;
//     await premiumUser.save();

//     // Update the credit request status to 'done'
//     creditRequest.status = 'done';
//     await creditRequest.save();
  
//     await .create({
//         creditAmount:creditAmount,
//         resellerId: reId,
//         transferDate: new Date(),
//     });
  
//     // Update the credit request status
//     creditRequest.status = "done";
//     await creditRequest.save();
  
//       res.status(200).json({
//         success: true,
//         message: "Credit transferred successfully",
//         data: {
//           reseller,
//           creditRequest,
//           remainingCredit: creditEntry.totalCredit,
//         },
//       });
//     } catch (error) {
//       console.error("Error transferring credit:", error);
//       res.status(500).json({
//         success: false,
//         message: "An error occurred while transferring credit",
//       });
//     }
//   };
  
  