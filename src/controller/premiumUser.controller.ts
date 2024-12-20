import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import PremiumUser from "../model/PremiumUser.model";


// get all premium users
export const getAllPremiumUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const premiumUsers = await PremiumUser.find()

    res.status(200).json({
      message: " premium users get successfully",
      data: premiumUsers,
    });
  } catch (err: any) {
    next(err)
  }
};

// get single premium user
export const getSinglePremiumUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const premiumUser = await PremiumUser.find({userId: req.params.id}).populate("userId");
    if (!premiumUser) {
      return res.status(404).json({ success: false, message: "Premium User not found" });
    }
    res.status(200).json({ 
      success: true,
      message: "Premium user get successfully", 
      data: premiumUser });
  } catch (err: any) {
    next(err)
  }
};

//get all premium user filter by email
export const getPremiumUserFilterByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    const user = await User.findOne({ email }).select("_id");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const premiumUsers = await PremiumUser.find({ userId: user._id }) .populate("userId", "name email") // Populate user info (name, email)
      .exec();

    if (premiumUsers.length === 0) {
      return res.status(404).json({ message: "No premium users found for this email" });
    }

    res.status(200).json(premiumUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get premium user filter by subscriptionStatus
export const getPremiumUserFilterBySubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { subscriptionStatus } = req.query;

    if (!subscriptionStatus) {
      return res.status(400).json({ message: "SubscriptionStatus parameter is required" });
    }

    // Filter PremiumUsers by subscriptionStatus
    const premiumUsers = await PremiumUser.find({ subscriptionStatus });

    if (premiumUsers.length === 0) {
      return res.status(404).json({ message: "No premium users found with this subscription status" });
    }

    res.status(200).json(premiumUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get premium user filter by resellerReference
export const getPremiumUserFilterByResellerReference = async (req: Request, res: Response) => {
  try {
    const { resellerReference } = req.query;

    if (!resellerReference) {
      return res.status(400).json({ message: "ResellerReference parameter is required" });
    }

    // Filter PremiumUsers by resellerReference
    const premiumUsers = await PremiumUser.find({ resellerReference });

    if (premiumUsers.length === 0) {
      return res.status(404).json({ message: "No premium users found with this reseller reference" });
    }

    res.status(200).json(premiumUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// create new premium  user
export const createPremiumUser  = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { userId, subscriptionType, resellerReference } = req.body;
  
      if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
      }
  
      const user = await User.findById(userId).select("email");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const premiumUser = await PremiumUser.findOneAndUpdate(
        { userId },
        {
          userType: "Premium",
          subscriptionType,
          resellerReference,
          subscriptionStatus: "Active",
        },
        { new: true, upsert: true }
      );

      res.status(200).json({
        message: "User successfully subscribed",
        userEmail: user.email,
        premiumUser
      });
  } catch (err: any) {
    next(err)
  }
};

// update premium user 
export const updatePremiumUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    console.log(user);
    if (!user) {
      throw new Error("User not found")
    }

    // Update the PremiumUser by userId
    const updatedUser = await PremiumUser.findOneAndUpdate(
      { userId: userId }, 
      req.body, 
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Premium user not found" });
    }

    res.status(200).json({
      message: "premium user updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    next(err)
  }
};

// update subscription status premium user 
export const updateSubscriptionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found")
    }

    const updatedSubscriptionStatus = await PremiumUser.updateOne(
      { userId: userId }, 
      { $set: { subscriptionStatus: "Inactive" } } 
    );
    if (updatedSubscriptionStatus.modifiedCount > 0) {
      console.log("User's subscription status updated to Inactive.");
    }

    res.status(200).json({
      message: "subscription status update  successfully",
      data: updatedSubscriptionStatus,
    });
  } catch (err: any) {
    next(err)
  }
};


// delete premium user
export const deletePremiumUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await PremiumUser.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new Error("User not found")
    }

    res.status(200).json({
      message: "premium user Deleted Successfully",
    });
  } catch (err: any) {
    next(err)
  }
};

