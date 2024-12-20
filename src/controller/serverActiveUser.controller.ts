import { NextFunction, Request, Response } from "express";
import ServerActiveUser from "../model/serverAssignmentModel";
import Server from "../model/server.model";


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

    res.status(200).json({
      message:'active users fetched successfully',
      count:activeUsers.length,
      data: activeUsers });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// Controller to get all servers with active user count
export const getAllServersWithActiveUserCount = async (req: Request, res: Response) => {
  try {
    // Aggregate to get servers with active user count and updatedAt
    const servers = await Server.aggregate([
      {
        $lookup: {
          from: 'serveractiveusers', // Name of the ServerActiveUser collection
          localField: 'ipAddress', // Match the ipAddress of Server collection
          foreignField: 'serverIP', // Match the serverIP field in ServerActiveUser collection
          as: 'activeUsers', // We will now have an array of active users
        },
      },
      {
        $addFields: {
          activeUserCount: {
            $size: {
              $filter: {
                input: '$activeUsers', // The array of active users
                as: 'user', // Each element in the array will be called 'user'
                cond: { $eq: ['$$user.userStatus', 'active'] }, // Filter by active status
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field
          serverId: '$_id', // Rename _id to serverId
          serverName: 1, // Include serverName
          activeUserCount: 1, // Include activeUserCount
          updatedAt: 1, // Include updatedAt
        },
      },
    ]);

    if (!servers || servers.length === 0) {
      return res.status(404).json({ message: 'No servers found' });
    }

    res.status(200).json({ servers });
  } catch (error) {
    console.error('Error fetching servers with active user count:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
