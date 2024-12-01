import { NextFunction, Request, Response } from "express";
import Reseller from "../model/reseller.model";
import PremiumUser from "../model/PremiumUser.model"; 
import User from "../model/user.model";


//get total resellers count
export const getTotalResellersCount = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const totalResellers = await Reseller.countDocuments();
    return res.json({ totalResellers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting total resellers count" });
  }
};

//get total active premium users
export const countTotalActivePremiumUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalActivePremiumUsers = await PremiumUser.countDocuments({
      subscriptionStatus: "Active",
    });

    return res.status(200).json({
      message: "Total active premium users count retrieved successfully.",
      data: {
        totalActivePremiumUsers,
      },
    });
  } catch (error) {
    next(error);  
  }
};

// Controller to filter by resellerId
export const filterPremiumUsersByResellerId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resellerId } = req.query;

    if (!resellerId) {
      return res.status(400).json({
        message: "Reseller ID is required.",
      });
    }

    const premiumUsersCountByReseller = await PremiumUser.aggregate([
      {
        $match: { subscriptionStatus: "Active", resellerReference: resellerId },
      },
      {
        $group: {
          _id: "$resellerReference",
          totalPremiumUsers: { $sum: 1 },
        },
      },
    ]);

    const populatedResellers = await Promise.all(
      premiumUsersCountByReseller.map(async (item) => {
        const reseller = await Reseller.findOne({ resellerId: item._id });
        const userReseller = reseller ? await User.findById(item._id) : null;

        return {
          resellerId: item._id,
          totalPremiumUsers: item.totalPremiumUsers,
          resellerEmail: userReseller ? userReseller.email : "No email",
          resellerName: userReseller ? userReseller.name : "Unknown Reseller",
          resellerCredit: reseller ? reseller.totalCredit : 0,
        };
      })
    );

    if (populatedResellers.length === 0) {
      return res.status(404).json({
        message: "No premium users found for the given resellerId.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Filtered premium users by resellerId retrieved successfully.",
      data: populatedResellers,
    });
  } catch (error) {
    next(error);
  }
};

export const filterPremiumUsersByResellerName = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { resellerName } = req.query;

   if (!resellerName || typeof resellerName !== 'string') {
    return res.status(400).json({
      message: "Reseller Name is required and should be a single string.",
    });
  }

  const searchName = resellerName.toLowerCase();

    const premiumUsersCountByReseller = await PremiumUser.aggregate([
      {
        $match: { subscriptionStatus: "Active" },
      },
      {
        $group: {
          _id: "$resellerReference",
          totalPremiumUsers: { $sum: 1 },
        },
      },
    ]);

    const populatedResellers = await Promise.all(
      premiumUsersCountByReseller.map(async (item) => {
        const reseller = await Reseller.findOne({ resellerId: item._id });
        const userReseller = reseller ? await User.findById(item._id) : null;

        if (userReseller && userReseller.name.toLowerCase().includes(searchName)) {
          return {
            resellerId: item._id,
            totalPremiumUsers: item.totalPremiumUsers,
            resellerEmail: userReseller ? userReseller.email : "No email",
            resellerName: userReseller ? userReseller.name : "Unknown Reseller",
            resellerCredit: reseller ? reseller.totalCredit : 0,
          };
        }
      })
    );

    const filteredResellers = populatedResellers.filter(item => item !== undefined);

    if (filteredResellers.length === 0) {
      return res.status(404).json({
        message: "No premium users found for the given resellerName.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Filtered premium users by resellerName retrieved successfully.",
      data: filteredResellers,
    });
  } catch (error) {
    next(error);
  }
};


// Controller to filter by resellerCredit
export const filterPremiumUsersByResellerCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resellerCredit } = req.query;

    if (!resellerCredit) {
      return res.status(400).json({
        message: "Reseller Credit is required.",
      });
    }

    const premiumUsersCountByReseller = await PremiumUser.aggregate([
      {
        $match: { subscriptionStatus: "Active" },
      },
      {
        $group: {
          _id: "$resellerReference",
          totalPremiumUsers: { $sum: 1 },
        },
      },
    ]);

    const populatedResellers = await Promise.all(
      premiumUsersCountByReseller.map(async (item) => {
        const reseller = await Reseller.findOne({ resellerId: item._id });
        const userReseller = reseller ? await User.findById(item._id) : null;

        if (reseller && reseller.totalCredit >= Number(resellerCredit)) {
          return {
            resellerId: item._id,
            totalPremiumUsers: item.totalPremiumUsers,
            resellerEmail: userReseller ? userReseller.email : "No email",
            resellerName: userReseller ? userReseller.name : "Unknown Reseller",
            resellerCredit: reseller ? reseller.totalCredit : 0,
          };
        }
      })
    );

    const filteredResellers = populatedResellers.filter(item => item !== undefined);

    if (filteredResellers.length === 0) {
      return res.status(404).json({
        message: "No premium users found for the given resellerCredit.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Filtered premium users by resellerCredit retrieved successfully.",
      data: filteredResellers,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to filter by totalPremiumUsers
export const filterPremiumUsersByTotalUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { totalPremiumUsers } = req.query;

    if (!totalPremiumUsers) {
      return res.status(400).json({
        message: "Total Premium Users count is required.",
      });
    }

    const premiumUsersCountByReseller = await PremiumUser.aggregate([
      {
        $match: { subscriptionStatus: "Active" },
      },
      {
        $group: {
          _id: "$resellerReference",
          totalPremiumUsers: { $sum: 1 },
        },
      },
    ]);

    const populatedResellers = await Promise.all(
      premiumUsersCountByReseller.map(async (item) => {
        const reseller = await Reseller.findOne({ resellerId: item._id });
        const userReseller = reseller ? await User.findById(item._id) : null;

        if (item.totalPremiumUsers >= Number(totalPremiumUsers)) {
          return {
            resellerId: item._id,
            totalPremiumUsers: item.totalPremiumUsers,
            resellerEmail: userReseller ? userReseller.email : "No email",
            resellerName: userReseller ? userReseller.name : "Unknown Reseller",
            resellerCredit: reseller ? reseller.totalCredit : 0,
          };
        }
      })
    );

    const filteredResellers = populatedResellers.filter(item => item !== undefined);

    if (filteredResellers.length === 0) {
      return res.status(404).json({
        message: "No premium users found for the given totalPremiumUsers.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Filtered premium users by totalPremiumUsers retrieved successfully.",
      data: filteredResellers,
    });
  } catch (error) {
    next(error);
  }
};

// get total users for all resellers
// export const getTotalPremiumUsersForAllResellers = async (req: Request, res: Response) => {
//   try {
//     // Aggregate to count the number of premium users for each reseller
//     const premiumUsersCountByReseller = await PremiumUser.aggregate([
//       {
//         $match: { subscriptionStatus: "Active" },  // Only consider active premium users
//       },
//       {
//         $group: {
//           _id: "$resellerReference",  // Group by resellerReference
//           totalPremiumUsers: { $sum: 1 },  // Count the number of premium users for each reseller
//         },
//       },
//       {
//         $lookup: {
//           from: "users",  // Lookup in the User collection
//           localField: "_id",  // Match resellerReference with _id of User
//           foreignField: "_id",  // Match it with the _id of the User
//           as: "resellerDetails",  // Add reseller details to the output
//         },
//       },
//       {
//         $unwind: {
//           path: "$resellerDetails",  // Unwind to flatten the result
//           preserveNullAndEmptyArrays: true,  // Allow resellers with no users to be included
//         },
//       },
//       {
//         $project: {
//           resellerId: "$_id",  // Reseller ID
//           totalPremiumUsers: 1,  // Total premium users for this reseller
//           resellerEmail: { $ifNull: ["$resellerDetails.email", "No email"] }, // Reseller email or fallback to "No email"
//           resellerName: { $ifNull: ["$resellerDetails.name", "Unknown Reseller"] }, 
//         },
//       },
//     ]);

//     if (premiumUsersCountByReseller.length === 0) {
//       return res.status(404).json({
//         message: "No premium users found for any resellers.",
//         data: [],
//       });
//     }

//     return res.status(200).json({
//       message: "Total premium users per reseller retrieved successfully.",
//       data: premiumUsersCountByReseller,
//     });
//   } catch (error) {
//     next(error)
//   }
// };

//get total available credits for all resellers
export const getTotalCredits = async (req: Request, res: Response) => {
  try {
    const totalCredits = await Reseller.aggregate([
      { $group: { _id: null, totalCredits: { $sum: "$totalCredit" } } },
    ]);
    const totalCreditSum = totalCredits.length ? totalCredits[0].totalCredits : 0;
    return res.json({ 
      message: "Get available credits retrieved successfully.",
      totalCredits: totalCreditSum });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error calculating total credits" });
  }
};

//get resellers with low credits (below a defined threshold)
export const getLowCreditResellers = async (req: Request, res: Response) => {
  const lowCreditThreshold = Number(req.query.threshold) || 300; 
  try {
    const lowCreditResellers = await Reseller.find({ totalCredit: { $lt: lowCreditThreshold } })
      .populate("resellerId", "name email");
    return res.json({ lowCreditResellers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching low credit resellers" });
  }
};

// get details of a specific reseller
export const getResellerDetails = async (req: Request, res: Response) => {
  const resellerId = req.params.id;
  try {
    const reseller = await Reseller.findById(resellerId).populate("resellerId", "name email");
    if (!reseller) {
      return res.status(404).json({ message: "Reseller not found" });
    }
    return res.json({ reseller });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching reseller details" });
  }
};
function next(err: any) {
  throw new Error("Function not implemented.");
}

//get total users for all resellers
export const getTotalPremiumUsersForAllReseller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const premiumUsersCountByReseller = await PremiumUser.aggregate([
      {
        $match: { subscriptionStatus: "Active" }, 
      },
      {
        $group: {
          _id: "$resellerReference",  
          totalPremiumUsers: { $sum: 1 },  
        },
      },
    ]);

    const populatedResellers = await Promise.all(
      premiumUsersCountByReseller.map(async (item) => {
        const reseller = await Reseller.findOne({ resellerId: item._id });

        const userReseller = reseller ? await User.findById(item._id) : null;

        return {
          resellerId: item._id,
          totalPremiumUsers: item.totalPremiumUsers,
          resellerEmail: userReseller ? userReseller.email : "No email",
          resellerName: userReseller ? userReseller.name : "Unknown Reseller",
          resellerCredit: reseller ? reseller.totalCredit : 0, 
        };
      })
    );

    if (populatedResellers.length === 0) {
      return res.status(404).json({
        message: "No premium users found for any resellers.",
        data: [],
      });
    }

    return res.status(200).json({
      message: "Total premium users per reseller retrieved successfully.",
      data: populatedResellers,
    });
  } catch (error) {
    next(error);  
  }
};


