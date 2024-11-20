import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";

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
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.role } },
      { new: true },
    );

    if (!user) {
      throw new Error("user not found")
    }

    res.status(200).json({
      message: " user role changed successfully",
      data: user,
    });
  } catch (err: any) {
    next(err)
  }
};
