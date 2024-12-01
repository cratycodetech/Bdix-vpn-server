import { NextFunction, Request, Response } from "express";
import Credit from "../model/credit.model";
import RequestModel from "../model/request.model";
import Reseller from "../model/reseller.model";
import User from "../model/user.model";
import TransferHistory from "../model/transferHistory.model";
import mongoose from "mongoose";

// get all credits
export const getAllCredit = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const credits = await Credit.find({});

    res.status(200).json({
      message: "Credits get successfully",
      data: credits,
    });
  } catch (err: any) {
    next(err)
  }
};

// get total credit 
export const getTotalCredit = async (_: Request, res: Response, next: NextFunction) => {
  try {

    const creditEntries = await Credit.find().sort({ createdAt: -1 }).limit(1);

    const creditEntry = creditEntries[0]; 
    res.status(200).json({
      message: "Credits get successfully",
      data: creditEntry.fixedTotalCredit,
    });
  } catch (err: any) {
    next(err)
  }
};


// Get all credit requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const { status, userType, search } = req.query;

    const query: any = {};
    if (status) {
      query.status = status;
    }
    if (userType) {
      query.userType = userType;
    }
    if (search) {
      query.transactionId = { $regex: search, $options: "i" }; // Search by transactionId
    }

    // Populate the reseller's details from the User model
    const requests = await RequestModel.find(query)
      .populate({
        path: "resellerId", 
        select: "name email phone role", 
        model: "User",
      })
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "An error occurred while fetching requests", error });
  }
};

export const countPendingRequestCredits = async (req: Request, res: Response) => {
  try {
    const pendingRequestCount = await RequestModel.countDocuments({ status: "pending" });

    const pendingTotalCredit = await RequestModel.aggregate([
      {
        $match: { status: "pending" } 
      },
      {
        $group: {
          _id: null,
          totalCredit: { $sum: "$creditAmount" } 
        }
      }
    ]);

    const totalCredit = pendingTotalCredit.length > 0 ? pendingTotalCredit[0].totalCredit : 0;

    res.status(200).json({
      success: true,
      message: "Pending request count and total pending credit retrieved successfully",
      data: {
        pendingRequestCount,
        pendingTotalCredit: totalCredit
      },
    });
  } catch (error) {
    console.error("Error counting pending credit requests:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while counting pending credit requests",
    });
  }
};

// get single credit
export const getSingleCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const credit= await Credit.findById(req.params.id);

    res.status(200).json({
      message: "Credit get successfully",
      data: credit,
    });
  } catch (err: any) {
    next(err)
  }
};

// get credit history
export const getCreditHistory = async (req: Request, res: Response) => {
  const { adminId } = req.params;

  try {
    const creditData = await Credit.findOne({ adminId }).populate("adminId");

    if (!creditData) {
      return res.status(404).json({ message: "No credit history found for this admin." });
    }
    res.status(200).json({
      success: true,
      history: creditData.history,
    });
  } catch (error) {
    console.error("Error fetching credit history:", error);
    res.status(500).json({ message: "An error occurred while fetching credit history." });
  }
};

//get all credit history
export const getAllCreditHistories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const creditHistories = await Credit.find({}, { history: 1 });

    if (!creditHistories || creditHistories.length === 0) {
      return res.status(404).json({ message: "No credit histories found." });
    }

    res.status(200).json({
      success: true,
      message: "All credit histories fetched successfully.",
      data: creditHistories,
    });
  } catch (err) {
    next(err);
  }
};

// create new credit
export const addCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const { adminId, action, credit } = req.body;

    if (Object.keys(data).length === 0) {
      throw new Error("Data can't be empty")
    }

    const credit1 = await Credit.create(data);

    const newHistory = {
      action,
      credit,
      adminId,
      date: new Date(),
    };

    credit1.history?.push(newHistory); 
    await credit1.save();

    res.status(201).json({
      message: "Credit created Successfully",
      data: credit1,
    });
  } catch (err: any) {
    next(err)
  }
};

//generate Credit or update credit and maintain history
export const addCreditHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId, action, credit } = req.body;

    if (!adminId || !action || credit == null) {
      return res.status(400).json({ message: "Admin ID, action, and credit are required." });
    }

    const creditData = await Credit.findOne({ adminId });
    if (!creditData) {
      return res.status(404).json({ message: "No credit record found for this admin." });
    }

    // Update totalCredit based on the action
    if (action === "Added") {
      creditData.totalCredit += credit;
      creditData.fixedTotalCredit += credit;
    } else if (action === "Deducted") {
      if (creditData.totalCredit - credit < 0) {
        return res.status(400).json({ message: "Total credit cannot be negative." });
      }
      creditData.totalCredit -= credit;
      creditData.fixedTotalCredit -= credit;
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'Added' or 'Deducted'." });
    }

    const newHistory = {
      action,
      credit,
      date: new Date(),
    };
    creditData.history?.push(newHistory);

    await creditData.save();

    res.status(200).json({
      success: true,
      message: "Total credit updated and history added successfully.",
      data: creditData,
    });
  } catch (err) {
    next(err);
  }
};

// Create a new credit request
export const createCreditRequest = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "An error occurred while creating the request", error });
  }
};

// transfer credit to reseller
export const transferCreditToReseller = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    const creditRequest = await RequestModel.findById({ _id: requestId });
    if (!creditRequest) {
      return res.status(404).json({ message: "Credit request not found" });
    }

    if (creditRequest.status !== "pending") {
      return res.status(400).json({ message: "Credit request already processed" });
    }

    const { resellerId, creditAmount } = creditRequest;

    if (!resellerId) {
      return res.status(400).json({ message: "Invalid reseller ID" });
    }

    const reId = resellerId.toString();

    const reseller = await Reseller.findOne({ resellerId: reId });
    if (!reseller) {
      return res.status(404).json({ message: "Reseller not found" });
    }

    const creditEntries = await Credit.find().sort({ createdAt: -1 }).limit(1);

    if (!creditEntries.length) {
      return res.status(404).json({ message: "Admin's credit entry not found" });
    }

    const creditEntry = creditEntries[0]; // Get the first (latest) credit entry

    if (creditEntry.totalCredit < creditAmount) {
      return res.status(400).json({ message: "Insufficient total credit" });
    }

    // Transfer credit to reseller
    reseller.totalCredit = (reseller.totalCredit || 0) + creditAmount;
    await reseller.save();

    // Reduce total credit in the Credit model
    creditEntry.totalCredit -= creditAmount;

    // add the transaction in the history
    creditEntry.history?.push({
      credit: creditAmount,
      action: "Deducted",
      date: new Date(),
    });

    await creditEntry.save();

    await TransferHistory.create({
      creditAmount:creditAmount,
      resellerId: reId,
      transferDate: new Date(),
    });

    // Update the credit request status
    creditRequest.status = "done";
    await creditRequest.save();

    res.status(200).json({
      success: true,
      message: "Credit transferred successfully",
      data: {
        reseller,
        creditRequest,
        remainingCredit: creditEntry.totalCredit,
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

// update Credit
export const updateCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data=await Credit.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({
      message: "Credit updated successfully",
      data: data,
    });
  } catch (err: any) {
    next(err)
  }
};

// delete Credit
export const deleteCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Credit.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Credit Deleted Successfully",
    });
  } catch (err: any) {
    next(err)
  }
};

//total transfer credit according to month
export const getMonthlyCreditSummary = async (req: Request, res: Response) => {
  try {

    const currentYear = new Date().getFullYear();
    const totalTransferredCredit = await TransferHistory.aggregate([
      {
        $match: {
          transferDate: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$transferDate" }, month: { $month: "$transferDate" } },
          totalTransferred: { $sum: "$creditAmount" },
        },
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          totalTransferred: 1,
          _id: 0,
        },
      },
    ]);

    const availableCredit = await Credit.findOne()
      .sort({ createdAt: -1 }) 
      .select("totalCredit");

    const summary = totalTransferredCredit.map((entry) => {
      const month = `${entry.year}-${entry.month.toString().padStart(2, "0")}`;
      return {
        month,
        totalTransferred: entry.totalTransferred,
        availableCredit: availableCredit?.totalCredit || 0,
      };
    });

    res.status(200).json({
      success: true,
      message: "Monthly credit summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching monthly credit summary:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the credit summary",
    });
  }
};
