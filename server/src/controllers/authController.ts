import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import passport from "passport";
import axios from "axios";

// Helper function to generate JWT token.
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

export const googleAuthCallback = (req: Request, res: Response) => {
  passport.authenticate("google", { session: false }, (err: Error, user: IUser) => {
    if (err || !user) {
      console.error("Google auth callback error:", err);
      return res.status(400).json({ error: "Google authentication failed" });
    }
    const token = generateJWTToken(user);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  })(req, res);
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      console.error("Missing Google token in request");
      res.status(400).json({ error: "Missing Google token" });
      return;
    }

    // Get user info from Google
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.data?.sub || !response.data?.email) {
      console.error("Invalid Google response data:", response.data);
      res.status(400).json({ error: "Invalid Google response" });
      return;
    }

    const googleUser = {
      id: response.data.sub,
      email: response.data.email,
      firstName: response.data.given_name || (response.data.name ? response.data.name.split(" ")[0] : "User"),
      lastName: response.data.family_name || (response.data.name ? response.data.name.split(" ").slice(1).join(" ") : "User"),
      avatar: response.data.picture || "/default-avatar.png",
    };

    // Find or create the user
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

export const registerUser = async (req: Request, res: Response): Promise<void> => {
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
      console.error("Invalid login attempt, user not found or no password:", email);
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

// This is used by the auth router to get the user profile.
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      console.error("Unauthorized access to profile");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const foundUser = await User.findById(user.userId).select("firstName lastName avatar role email isInvited");
    if (!foundUser) {
      console.error("User not found with ID:", user.userId);
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
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.userId; // From authenticateUser middleware

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if the user has a password (Google users may not)
    if (!user.password) {
      res.status(400).json({ error: "Cannot change password for Google users" });
      return;
    }

    // Verify the current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    // Update the password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
};