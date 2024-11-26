import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import Reseller from "../model/reseller.model";


// get all users
export const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find()

    res.status(200).json({
      message: "Users get successfully",
      data: users,
    });
  } catch (err: any) {
    next(err)
  }
};

// get single user
export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      throw new Error("User Not found")
    }

    res.status(200).json({
      message: "User get successfully",
      data: user,
    });
  } catch (err: any) {
    next(err)
  }
};

// get admin 
export const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    const admin = await User.findOne({ email, role: 'Admin' });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found with this email" });
    }

    res.status(200).json({
      message: "Admin get successfully",
      data: admin,
    });
  } catch (err: any) {
    next(err)
  }
};

// get reseller 
export const getReseller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    const reseller = await User.findOne({ email, role: 'Reseller' });

    if (!reseller) {
      return res.status(404).json({ error: "Reseller not found with this email" });
    }


    res.status(200).json({
      message: "Reseller get successfully",
      data: reseller,
    });
  } catch (err: any) {
    next(err)
  }
};

// update a user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found")
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body);

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    next(err)
  }
};

// delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw new Error("User not found")
    }

    res.status(200).json({
      message: "User Deleted Successfully",
    });
  } catch (err: any) {
    next(err)
  }
};

// update user role
export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;

    // Update the user's role
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role } },
      { new: true } // Return the updated document
    );

    if (!user) {
      throw new Error("User not found");
    }

    // If the role is updated to "Reseller", create a corresponding reseller entry
    if (user.role === "Reseller") {
      // Check if a reseller entry already exists
      const existingReseller = await Reseller.findOne({ resellerId: user._id });
      if (!existingReseller) {
        // Create a new reseller entry
        await Reseller.create({
          resellerId: user._id, // Reference to the User model
          totalCredit: 0, // Default credit for new resellers
        });
      }
    }

    res.status(200).json({
      message: "User role updated successfully",
      data: user,
    });
  } catch (err: any) {
    next(err);
  }
};