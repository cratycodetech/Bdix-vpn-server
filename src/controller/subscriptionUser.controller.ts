import { Request, Response } from "express";
import PremiumUser from "../model/PremiumUser.model";

// Get total subscriptions and count by subscription type
export const getSubscriptionStats = async (req: Request, res: Response) => {
  try {
    // Predefined subscription types
    const subscriptionTypes = ["Monthly", "Yearly", "Half-Yearly"];

    // Get total subscriptions
    const totalSubscriptions = await PremiumUser.countDocuments({subscriptionType :subscriptionTypes});

    // Get counts by subscription type
    const subscriptionTypeStats = await PremiumUser.aggregate([
      {
        $group: {
          _id: "$subscriptionType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          subscriptionType: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Map the results to ensure all subscription types are included with a default count of 0
    const formattedStats = subscriptionTypes.reduce((acc, type) => {
      const typeStat = subscriptionTypeStats.find(stat => stat.subscriptionType === type);
      acc[type] = typeStat ? typeStat.count : 0;
      return acc;
    }, {} as Record<string, number>);

    res.status(200).json({
      totalSubscriptions: totalSubscriptions || 0,
      subscriptionTypeStats: formattedStats,
    });
  } catch (error) {
    console.error("Error fetching subscription stats:", error);
    res.status(500).json({ message: "Error fetching subscription stats" });
  }
};
