import { Request, Response } from 'express';
import TransferHistory from '../model/transferHistory.model';
import moment from 'moment';
import User from '../model/user.model';
import PremiumUser from '../model/PremiumUser.model';
import { count } from 'console';

// get transfer history for the current month
export const getCurrentMonthTransferHistory = async (req: Request, res: Response) => {
  try {

    const startOfMonth = moment().startOf('month').toDate();
    const endOfMonth = moment().endOf('month').toDate();

    const transferHistory = await TransferHistory.find({
      transferDate: {
        $gte: startOfMonth,  
        $lte: endOfMonth     
      }
    }).populate('resellerId transferredBy');

    return res.status(200).json({ message: 'Transfer history for current month fetched successfully', transferHistory });
  } catch (error :any) {
    return res.status(500).json({ message: 'Error fetching transfer history for the current month', error: error.message });
  }
};



//get all login users for a specific month
export const getMonthlyLogins = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({ message: "Month and Year are required." });
      return;
    }

    const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
    const endOfMonth = new Date(Number(year), Number(month), 0, 23, 59, 59);

    const totalLogins = await User.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    res.status(200).json({
      success: true,
      message: `Logins for ${month}/${year} fetched successfully`,
      count: totalLogins.length,
      data: totalLogins

    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//get all subscribed users for a specific month
export const getSubscribedUsersByMonth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({ success: false, message: "Month and year are required" });
      return;
    }

    const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
    const endOfMonth = new Date(Number(year), Number(month), 0, 23, 59, 59);

    const subscribedUsers = await PremiumUser.find({
      userType: "Premium",
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).populate("userId", "name email");

    res.status(200).json({
      success: true,
      message: `Subscribed users for ${month}/${year} fetched successfully`,
      data: subscribedUsers,
    });
  } catch (error) {
    console.error("Error fetching subscribed users by month:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};
