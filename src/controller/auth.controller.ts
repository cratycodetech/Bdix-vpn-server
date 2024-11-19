import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";
import Admin from "../model/admin.model";
import Blacklist from "../model/blacklist.model";
import { generateToken, getBearerToken } from "./../utils/token";

// admin signup
export const adminSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { adminId, email, password } = req.body;
    const admin = await Admin.findOne({ email: email });

    if (admin) {
      throw new Error("email already exist");
    }

    const savedAdmin = await Admin.create(req.body);
    await savedAdmin.save({ validateBeforeSave: false });

    res.status(200).json({
      message: "Admin signup successful",
    });
  } catch (err: any) {
    next(err);
  }
};

// admin login
export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide your credentials");
    }

    const admin = await Admin.findOne({ email });

    //console.log(admin);

    if (!admin) {
      throw new Error("No admin found. Please create an account");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new Error("Password is incorrect");
    }

    if (!admin.status) {
      throw new Error("The admin is banned");
    }

    const token = generateToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role.toLowerCase(),
    });
    const { password: pwd, ...info } = admin.toObject();

    res.status(200).json({
      message: "admin Login successful",
      data: {
        ...info,
        role: admin.role,
        token,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = await getBearerToken(req);
    await Blacklist.create({ token: token });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (err: any) {
    next(err);
  }
};

// Reset Password based on Email
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      throw new Error("No admin found with this email");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Admin.updateOne(
        { email }, 
        { $set: { password: hashedPassword } },
      );

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (err: any) {
    next(err);
  }
};


// Forgot Password
// export const forgotPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { email } = req.body;
//     const admin = await Admin.findOne({ email });

//     if (!admin) {
//       throw new Error("No admin found with this email");
//     }

//     // Generate reset token and set expiration
//     const resetToken = generateToken({
//       id: admin._id.toString(),
//       email: admin.email,
//       role: admin.role.toLowerCase(),
//     });
//     //const resetToken = crypto.randomBytes(32).toString("hex");
//     console.log(resetToken);
//     admin.resetPasswordToken = resetToken;
//     admin.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

//     await admin.save({ validateBeforeSave: false });

//     // Send reset email (setup SMTP server for production)
//     const resetUrl = `localhost:7000/api/v1/auth/admin/reset-password?token=${resetToken}`;
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: admin.email,
//       subject: "Password Reset",
//       text: `You requested a password reset. Click here to reset your password: ${resetUrl}`,
//     };

//     transporter.sendMail(mailOptions, (error) => {
//       if (error) {
//         throw new Error("Error sending email");
//       } else {
//         console.log("Password reset email sent.");
//       }
//     });

//     res.status(200).json({ message: "Password reset email sent." });
//   } catch (err: any) {
//     next(err);
//   }
// };

// // Reset Password
// export const resetPassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { token, newPassword, confirmPassword } = req.body;

//     if (newPassword !== confirmPassword) {
//       throw new Error("Passwords do not match");
//     }

//     // Find admin by token and ensure the token is not expired
//     const admin = await Admin.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: new Date() }, // Token not expired
//     });

//     if (!admin) {
//       throw new Error("Invalid or expired reset token");
//     }

//     // Hash the new password and save it
//     const salt = await bcrypt.genSalt(10);
//     admin.password = await bcrypt.hash(newPassword, salt);
//     admin.resetPasswordToken = "";
//     admin.resetPasswordExpires = new Date();

//     await admin.save();

//     res.status(200).json({ message: "Password has been reset successfully" });
//   } catch (err: any) {
//     next(err);
//   }
// };
