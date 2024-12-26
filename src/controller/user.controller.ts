import { NextFunction, Request, Response } from "express";
import User from "../model/user.model";
import Reseller from "../model/reseller.model";
import PremiumUser from "../model/PremiumUser.model";
import Admin from "../model/admin.model";


// get all users
export const getAllUsers = async (_: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all users
    const users = await User.find();

    // Prepare the response data with role-specific information
    const userData = await Promise.all(
      users.map(async (user) => {
        let roleData = {};

        if (user.role === "User") {
          const premiumData = await PremiumUser.findOne({ userId: user._id });
          roleData = {
            ...user.toObject(),
            premiumInfo: premiumData || null,
          };
        } else if (user.role === "Reseller") {
          const resellerData = await Reseller.findOne({ resellerId: user._id });
          roleData = {
            ...user.toObject(),
            resellerInfo: resellerData || null,
          };
        } else if (user.role === "Admin") {
          const adminData = await Admin.findOne({ adminId: user._id });
          roleData = {
            ...user.toObject(),
            adminInfo: adminData || null,
          };
        }

        return roleData;
      })
    );

    res.status(200).json({
      message: "Users fetched successfully with role-based info",
      data: userData,
    });
  } catch (err: any) {
    next(err);
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
    const { role, ...updateFields } = req.body; 
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role, ...updateFields } },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    let updatedUser;

    if (role === "Reseller") {
      const email = user.email;

      const existingReseller = await Reseller.findOne({ resellerId: user._id });

      if (!existingReseller) {
        const premiumUser = await PremiumUser.findOne({ userId: user._id });
        if (premiumUser) {
          await PremiumUser.deleteOne({ userId: user._id });
        }

        updatedUser = await Reseller.create({
          resellerId: user._id,
          totalCredit: 0,
          transferCredit: 0,
          availableCredit: 0,
          email: email,
        });
      } else {
        updatedUser = await Reseller.findOneAndUpdate(
          { resellerId: user._id },
          { ...updateFields },
          { new: true }
        );

        await User.findByIdAndUpdate(
          userId,
          { email: updatedUser?.email },
          { new: true }
        );
      }
    } else if (role === "Admin") {
      const email = user.email;

      const existingAdmin = await Admin.findOne({ adminId: user._id });

      if (!existingAdmin) {
        const premiumUser = await PremiumUser.findOne({ userId: user._id });
        if (premiumUser) {
          await PremiumUser.deleteOne({ userId: user._id });
        }

        updatedUser = await Admin.create({
          adminId: user._id,
          email: email,
        });
      } else {
        updatedUser = await Admin.findOneAndUpdate(
          { adminId: user._id },
          { ...updateFields },
          { new: true }
        );
        await User.findByIdAndUpdate(
          userId,
          { email: updatedUser?.email },
          { new: true }
        );
      }
    } else {
       updatedUser = await PremiumUser.findOneAndUpdate(
        { userId: user._id },
        updateFields,
        { new: true, upsert: true } 
      );

      await User.findByIdAndUpdate(
        userId,
        { email: updateFields.email || user.email },
        { new: true }
      );

      updatedUser = updatedUser || user; 
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
      user:user
    });
  } catch (err: any) {
    next(err);
  }
};

// delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("User not found");
    }

    // Determine role and delete associated records
    if (user.role === "User") {
      await PremiumUser.deleteOne({ userId: req.params.id });
    } else if (user.role === "Admin") {
      await Admin.deleteOne({ adminId: req.params.id });
    } else if (user.role === "Reseller") {
      await Reseller.deleteOne({ resellerId: req.params.id });
    }

    // Delete the user from the User model
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err: any) {
    next(err)
  }
};

// update user role
// export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { role } = req.body;
//     const userId = req.params.id;

//     // Update the user's role in the User model
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: { role } },
//       { new: true }
//     );

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // If the user is changing to 'Reseller'
//     if (role === "Reseller") {

//       // Check if the user already exists in the Reseller model
//       const existingReseller = await Reseller.findOne({ resellerId: user._id });
      
//       // If the user does not already exist as a Reseller, create a new Reseller record
//       if (!existingReseller) {
//         const email = user.email;

//         await Reseller.create({
//           resellerId: user._id,
//           totalCredit: 0,
//           email: email,
//         });

//          // Check if the user exists in PremiumUser model
//       const premiumUser = await PremiumUser.findOne({ userId: user._id });

//       if (premiumUser) {
//         // If the user is in PremiumUser, remove from PremiumUser model
//         await PremiumUser.deleteOne({ userId: user._id });
//       }
//       }
//     }

//     // If the user is changing to 'Reseller'
//     if (role === "User") {

//       // Check if the user already exists in the Reseller model
//       const existingReseller = await Reseller.findOne({ resellerId: user._id });
      
//       // If the user does not already exist as a Reseller, create a new Reseller record
//       if (!existingReseller) {
//         const email = user.email;

//         await Reseller.create({
//           resellerId: user._id,
//           totalCredit: 0,
//           email: email,
//         });

//          // Check if the user exists in PremiumUser model
//       const premiumUser = await PremiumUser.findOne({ userId: user._id });

//       if (premiumUser) {
//         // If the user is in PremiumUser, remove from PremiumUser model
//         await PremiumUser.deleteOne({ userId: user._id });
//       }
//       }
//     }

//     res.status(200).json({
//       message: "User role updated successfully",
//       data: user,
//     });
//   } catch (err: any) {
//     next(err);
//   }
// };


// export const updateUserRoles = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { role } = req.body;
//     const userId = req.params.id;

//     // Fetch the current user's role before updating
//     const currentUser = await User.findById(userId);
//     if (!currentUser) {
//       throw new Error("User not found");
//     }
//     const previousRole = currentUser.role;

//     // Update the user's role in the User model
//     const user = await User.findByIdAndUpdate(
//       userId,
//       { $set: { role } },
//       { new: true }
//     );

//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Compare roles and apply necessary actions
//     if (previousRole !== role) {
//       switch (previousRole) {
//         case "User":
//           if (role === "Reseller") {
//             const email = user.email;
            
//             const existingReseller = await Reseller.findOne({ resellerId: user._id });

//             if (!existingReseller) {
//             // Add user to Reseller model
//             await Reseller.create({
//               resellerId: user._id,
//               totalCredit: 0,
//               transferCredit:0,
//               availableCredit:0,
//               email: email,
//             });

//           }else{
//             throw new Error("Reseller already  found");
//           }
//             // Remove user from PremiumUser model if exists
//             const premiumUser = await PremiumUser.findOne({ userId: user._id });
//             if (premiumUser) {
//               await PremiumUser.deleteOne({ userId: user._id });
//             }
//           } else if (role === "Admin") {
//               const email = user.email;
              
//               const existingAdmin = await Admin.findOne({ adminId: user._id });
  
//               if (!existingAdmin) {
//               // Add user to Admin model
//               await Admin.create({
//                 adminId: user._id,
//                 email: email,
//               });
  
//             }else{
//               throw new Error("Admin already  found");
//             }
//             const premiumUser = await PremiumUser.findOne({ userId: user._id });
//             if (premiumUser) {
//               await PremiumUser.deleteOne({ userId: user._id });
//             }
//           }
//           break;

//         case "Reseller":
//           if (role === "Admin") {
//             const email = user.email;
              
//             const existingAdmin = await Admin.findOne({ adminId: user._id });

//             if (!existingAdmin) {
//             // Add user to Admin model
//             await Admin.create({
//               adminId: user._id,
//               email: email,
//             });

//           }else{
//             throw new Error("Admin already  found");
//           }
//           const premiumUser = await PremiumUser.findOne({ userId: user._id });
//           if (premiumUser) {
//             await PremiumUser.deleteOne({ userId: user._id });
//           }
//             await Reseller.deleteOne({ resellerId: user._id });
//           } else if (role === "User") {
//             // Remove user from Reseller model
//             await Reseller.deleteOne({ resellerId: user._id });
//           }
//           break;

//         case "Admin":
//           if (role === "Reseller") {
//             const email = user.email;

//             // Add user to Reseller model
//             await Reseller.create({
//               resellerId: user._id,
//               totalCredit: 0,
//               email: email,
//             });
//           } else if (role === "User") {
//             // Remove user from Reseller model
//             await Reseller.deleteOne({ resellerId: user._id });
//           }
//           break;

//         default:
//           throw new Error("Invalid role transition");
//       }
//     }

//     res.status(200).json({
//       message: "User role updated successfully",
//       data: user,
//     });
//   } catch (err: any) {
//     next(err);
//   }
// };


// export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
//   try {

//     const { role } = req.body;
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { $set: { role } },
//       { new: true } 
//     );

//     if (!user) {
//       throw new Error("User not found");
//     }

//     if (user.role === "Reseller") {

//       const existingReseller = await Reseller.findOne({ resellerId: user._id });
      
//       if (!existingReseller) {
//         const email = user.email ;
        
//         await Reseller.create({
//           resellerId: user._id,
//           totalCredit: 0,
//           email: email, 
//         });
//       }
//     }

//     res.status(200).json({
//       message: "User role updated successfully",
//       data: user,
//     });
//   } catch (err: any) {
//     next(err);
//   }
// };