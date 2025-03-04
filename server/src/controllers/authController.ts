import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

const generateJWTToken = (user: any): string => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
};

// Google Auth Request typing
interface GoogleAuthRequest extends Request {
  body: {
    code: string;
    redirect_uri?: string;
  };
}

export const googleAuth = async (
  req: GoogleAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { code, redirect_uri } = req.body;
    console.log("Received Google auth code:", code.substring(0, 10) + "...");
    console.log("Using redirect_uri:", redirect_uri);

    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirect_uri || "postmessage",
    });
    console.log("Google tokens received:", tokens);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    console.log("Ticket verified:", ticket);

    const payload = ticket.getPayload();
    console.log("Google payload:", payload);

    if (!payload?.email) {
      console.error("No email in Google payload");
      res.status(401).json({ error: "Invalid authentication" });
      return;
    }

    let user = await User.findOne({ email: payload.email });
    console.log("Existing user found:", !!user);

    if (!user) {
      console.log("Creating new user from Google payload");
      user = await User.create({
        email: payload.email,
        name: payload.name || "Google User",
        googleId: payload.sub,
        firstName: payload.given_name || "Google",
        lastName: payload.family_name || "User",
        avatar: payload.picture,
        role: "user",
      });
    }

    const jwtToken = generateJWTToken(user);
    console.log("Generated JWT token for user:", user.email);

    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Full Google auth error:", error);
    res.status(401).json({
      error: "Invalid authentication",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Typing for register & login requests
interface AuthRequest extends Request {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

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
    if (!user || !(await user.comparePassword(password))) {
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

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.userId).select(
      "firstName lastName name avatar role email"
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      name: user.name || `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
