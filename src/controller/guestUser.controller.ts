import { NextFunction, Request, Response } from "express";
import Guest from "../model/guestUser.model";


//get all Guest user
export const getAllGuestUser = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const guestUsers = await Guest.find().sort({ createdAt: -1 }); ; 
    return res.status(200).json({ 
    success: true,
    message: "Get all guest user  successfully",
    count:guestUsers.length,
    data: guestUsers });
  } catch (error) {
    next(error)
  }
};

// Create a new Guest user
export const createGuestUser = async (req: Request, res: Response,next:NextFunction) => {
    try {
      const { deviceId,useId} = req.body;
  
      if (!deviceId) {
        return res.status(400).json({ message: "Device Id required" });
      }

      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 3600000);
    
      const newGuest = await Guest.create({
        deviceId: deviceId,
        startTime: startTime, 
        endTime: endTime, 
      });
      res.status(201).json({ message: "Guest user created successfully", data: newGuest });
    } catch (error: any) {
      next(error)
    }
  };
  
