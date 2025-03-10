import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";
import passport from "passport";
import axios from "axios";
import multer from "multer";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

// Typing for register & login requests
interface AuthRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

const generateJWTToken = (user: any): string => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      // Add refresh trigger
      timestamp: Date.now()
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleAuthCallback = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, (err: Error, user: IUser) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Google authentication failed' });
    }
    
    const token = generateJWTToken(user);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  })(req, res);
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    // Validate Google token
    if (!token) {
      res.status(400).json({ error: "Missing Google token" });
      return; // Exit the function after sending the response
    }

    // Get user info from Google
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Validate response data
    if (!response.data?.sub || !response.data?.email) {
      res.status(400).json({ error: "Invalid Google response" });
      return; // Exit the function after sending the response
    }

    // Extract user data with fallbacks
    const googleUser = {
      id: response.data.sub,
      email: response.data.email,
      firstName: response.data.given_name || response.data.name?.split(' ')[0] || 'User',
      lastName: response.data.family_name || response.data.name?.split(' ').slice(1).join(' ') || 'User',
      avatar: response.data.picture || '/default-avatar.png'
    };

    // Find or create user
    const user = await User.findOneAndUpdate(
      { email: googleUser.email },
      {
        $setOnInsert: {
          googleId: googleUser.id,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          avatar: googleUser.avatar,
          email: googleUser.email
        }
      },
      { upsert: true, new: true }
    );

    // Generate JWT token
    const jwtToken = generateJWTToken(user);
    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ error: "Google authentication failed" });
  }
};

export const registerUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const user = await User.create({ firstName, lastName, email, password });
    const token = generateJWTToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    console.error("Registration error:", error);
    // Send Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      res.status(400).json({ error: messages.join(", ") });
    } else {
      res.status(400).json({ error: "Registration failed" });
    }
  }
};

export const loginUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateJWTToken(user);
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
  const user = (req as AuthenticatedRequest).user;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const foundUser = await User.findById(user.userId).select(
    "firstName lastName name avatar role email isInvited"
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
    isInvited: foundUser.isInvited
  });
};