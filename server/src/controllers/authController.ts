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
  };
}

export const googleAuth = async (
  req: GoogleAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.body;

    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(401).json({ error: "Invalid authentication" });
      return;
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
      });
    }

    const jwtToken = generateJWTToken(user);
    res.json({ token: jwtToken });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({ error: "Invalid authentication" });
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
