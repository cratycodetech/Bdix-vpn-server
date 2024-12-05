import { NextFunction, Request, Response } from "express";
import ServerActiveUser from "../model/serverAssignmentModel";


export const getActiveServerUsers = async (req: Request, res: Response) => {
  try {
    
    const activeUsers = await ServerActiveUser.aggregate([
      {
        $match: { userStatus: 'active' }, 
      },
      {
        $lookup: {
          from: 'users', 
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails', 
      },
      {
        $lookup: {
          from: 'premiumusers', 
          localField: 'userId',
          foreignField: 'userId',
          as: 'premiumDetails',
        },
      },
      {
        $unwind: {
          path: '$premiumDetails',
          preserveNullAndEmptyArrays: true, 
        },
      },
      {
        $project: {
          _id: 0, 
          name: '$userDetails.name', 
          email: '$userDetails.email', 
          userId: '$userId', 
          subscriptionType: '$premiumDetails.subscriptionType', 
          credits: '$premiumDetails.credits', 
          resellerReference: '$premiumDetails.resellerReference', 
        },
      },
    ]);

    if (!activeUsers || activeUsers.length === 0) {
      return res.status(404).json({ message: 'No active users found' });
    }

    res.status(200).json({ activeUsers });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

  