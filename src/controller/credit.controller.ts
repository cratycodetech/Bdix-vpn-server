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



// Create or update Credit and maintain history
export const addCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId, credit } = req.body;

    if (!credit || credit < 50) {
      return res.status(400).json({ message: "Credit cannot be less than 50" });
    }

    const creditDoc = await Credit.findOneAndUpdate(
      { adminId }, 
      {
        $inc: { totalCredit: credit }, 
        $set: { credit },
        $push: { history: { credit, date: new Date() } } 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, credit: creditDoc });
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
