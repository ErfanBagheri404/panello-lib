import { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import passport from "passport";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as dotenv from "dotenv";
import { IUser } from "../types/express";
dotenv.config();

const generateJWTToken = (user: any): string => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      timestamp: Date.now(),
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "***" : "Missing", // Mask key for security
  api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "Missing",
});
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const googleAuthCallback = (req: Request, res: Response) => {
  passport.authenticate(
    "google",
    { session: false },
    (err: Error, user: IUser) => {
      if (err || !user) {
        console.error("Google auth callback error:", err);
        return res.status(400).json({ error: "Google authentication failed" });
      }
      const token = generateJWTToken(user);
      res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
    }
  )(req, res);
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      console.error("Missing Google token in request");
      res.status(400).json({ error: "Missing Google token" });
      return;
    }

    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!response.data?.sub || !response.data?.email) {
      console.error("Invalid Google response data:", response.data);
      res.status(400).json({ error: "Invalid Google response" });
      return;
    }

    const googleUser = {
      id: response.data.sub,
      email: response.data.email,
      firstName:
        response.data.given_name ||
        (response.data.name ? response.data.name.split(" ")[0] : "User"),
      lastName:
        response.data.family_name ||
        (response.data.name
          ? response.data.name.split(" ").slice(1).join(" ")
          : "User"),
      avatar: response.data.picture || "/default-avatar.png",
    };

    const user = await User.findOneAndUpdate(
      { email: googleUser.email },
      {
        $setOnInsert: {
          googleId: googleUser.id,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          avatar: googleUser.avatar,
          email: googleUser.email,
        },
      },
      { upsert: true, new: true }
    );

    const jwtToken = generateJWTToken(user);
    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ error: "Google authentication failed" });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User already exists with email:", email);
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const user = await User.create({ firstName, lastName, email, password });
    const token = generateJWTToken(user);
    console.log("User registered successfully:", user.email);
    res.status(201).json({ token });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      res.status(400).json({ error: messages.join(", ") });
    } else {
      res.status(400).json({ error: "Registration failed" });
    }
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      console.error(
        "Invalid login attempt, user not found or no password:",
        email
      );
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error("Invalid password for user:", email);
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = generateJWTToken(user);
    console.log("User logged in successfully:", email);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: "Login failed" });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const foundUser = await User.findById(user.userId).select(
      "firstName lastName avatar role email isInvited googleId"
    );
    if (!foundUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      avatar: foundUser.avatar,
      role: foundUser.role,
      email: foundUser.email,
      isInvited: foundUser.isInvited,
      googleId: foundUser.googleId,
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (user.googleId) {
      res
        .status(403)
        .json({ error: "Password change is not allowed for Google users" });
      return;
    }

    if (!user.password) {
      res
        .status(400)
        .json({ error: "Cannot change password for Google users" });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};
// authController.ts
export const updateAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const dataUri = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "avatars",
    });

    const user = await User.findByIdAndUpdate(
      (req as any).user.userId,
      { avatar: result.secure_url },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error("Avatar update error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const removeAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const defaultAvatar = (User.schema.path("avatar") as any).defaultValue;
    const user = await User.findByIdAndUpdate(
      (req as any).user.userId,
      { avatar: defaultAvatar },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error("Avatar removal error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
