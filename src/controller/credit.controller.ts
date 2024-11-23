import { NextFunction, Request, Response } from "express";
import Credit from "../model/credit.model";
import CreditRequest from "../model/creditRequest.model";

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


// get all credit credit request
export const getAllCreditRequest = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const credits = await CreditRequest.find({});

    res.status(200).json({
      message: "All credit request get successfully",
      data: credits,
    });
  } catch (err: any) {
    next(err)
  }
};

// get count all credit request
export const getCountAllCreditRequest = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const countCredits = await CreditRequest.countDocuments({});

    res.status(200).json({
      message: "Total credit count get successfully",
      data: countCredits,
    });
  } catch (err: any) {
    next(err)
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
    // Fetch credit document for the given adminId
    const creditData = await Credit.findOne({ adminId }).populate("adminId");

    if (!creditData) {
      return res.status(404).json({ message: "No credit history found for this admin." });
    }

    // Return the history field
    res.status(200).json({
      success: true,
      history: creditData.history,
    });
  } catch (error) {
    console.error("Error fetching credit history:", error);
    res.status(500).json({ message: "An error occurred while fetching credit history." });
  }
};

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

//update Credit and maintain history
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
    } else if (action === "Deducted") {
      if (creditData.totalCredit - credit < 0) {
        return res.status(400).json({ message: "Total credit cannot be negative." });
      }
      creditData.totalCredit -= credit;
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

// create new credit request
export const createCreditRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reseller, creditAmount, remark } = req.body;

    if (!reseller || !creditAmount) {
      return res.status(400).json({ message: "Reseller and credit amount are required." });
    }

    const newRequest = await CreditRequest.create(req.body);

    return res.status(201).json({
      message: "Credit request created successfully.",
      data: newRequest,
    });
  } catch (err: any) {
    next(err);
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
