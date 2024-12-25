import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import Blacklist from "../model/blacklist.model";
import { generateToken, getBearerToken } from "./../utils/token";
import User from "../model/user.model";
import PremiumUser from "../model/PremiumUser.model";
const crypto = require('crypto');
const nodemailer = require('nodemailer'); 

// signup
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    if (user) {
      throw new Error("email already exist",)
    }

    const savedUser = await User.create(req.body);
    await savedUser.save({ validateBeforeSave: false });

    await PremiumUser.create({
      userId:savedUser._id, 
      userType: "Free", 
      subscriptionStatus: "Inactive",
      credits: 0, 
    });

    res.status(200).json({
      message: "User signup successful",
    });
  } catch (err: any) {
    next(err)
  }
};

//login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please provide your credentials")
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("No user found. Please create an account",)
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Password is not correct")
    }

    const token = generateToken({
      id: user._id.toString(),
      name: user.name,
      email: user.email
    });

    // const userId=user._id.toString()
    // console.log(userId)

   // Check if the user has a premium user record
   const premiumUser = await PremiumUser.findOne({ userId: user._id.toString() });
   const userType = premiumUser?.userType|| null;

    const { password: pwd, ...info } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      data: {
        ...info,
        token,
        userType
      },
    });
  } catch (err: any) {
    next(err)
  }
};

// logout
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
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("No user found with this email");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.updateOne(
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


// Define type for otpStore
interface OTPData {
  otp: string;
  expiry: number;
}

// In-memory OTP store, mapped by email
let otpStore: { [key: string]: OTPData } = {};

// Utility function to generate OTP
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

// Controller to send OTP
export const sendOTP = async (req: Request, res: Response,next: NextFunction) => {
  const { email } = req.body;

  try {
    // const user=await User.findOne({email})
    // if(user){
    //   throw new Error("Email already exist.please try another email");
    // }


    const otp = generateOTP();
    const expiry = Date.now() + 10 * 60 * 1000; 
    otpStore[email] = { otp, expiry };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for 2FA',
      text: `Your OTP code is: ${otp}`,
    });

    res.status(200).json({
      message: "Otp sent successfully",
    });
  } catch (error:any) {
    next(error)
  }
};

// Controller to verify OTP
export const verifyOTP = (req: Request, res: Response) => {
  const { email, otp } = req.body;
  console.log("hit here", email, otp);

  const storedOtpData = otpStore[email];
  console.log("storedOtpData", storedOtpData);

  if (!storedOtpData) {
    return res.status(404).json({
      message: "OTP not found for this email.",
    });
  }

  if (storedOtpData.expiry < Date.now()) {
    delete otpStore[email];
    return res.status(400).json({
      message: "OTP has expired.",
    });
  }

  if (storedOtpData.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP. Please try again.",
    });
  }

  delete otpStore[email];

  res.status(200).json({
    message: "OTP verified successfully!",
  });
};




export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store the token (hashed) and expiration in the user's record
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetTokenExpiry = tokenExpiry;
    await user.save();

    // Send the reset link via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const message = `Click the link to reset your password: ${resetURL}`;

    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (err) {
    next(err);
  }
};



export const resetPasswords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the token to match the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the matching reset token and check expiration
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the reset token and expiry
    user.resetToken = "";
    user.resetTokenExpiry = null as Date | null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
