import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";
import jwt from "jsonwebtoken";import multer from 'multer';
import path from 'path';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

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

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user } = req as AuthenticatedRequest;

  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const foundUser = await User.findById(user.userId).select(
    "firstName lastName name avatar role email"
  );

  if (!foundUser) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    name: foundUser.name || `${foundUser.firstName} ${foundUser.lastName}`,
    avatar: foundUser.avatar,
    role: foundUser.role,
    email: foundUser.email,
  });
};


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req as AuthenticatedRequest;
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { avatar: avatarUrl },
      { new: true }
    ).select('avatar');

    res.json({ avatar: updatedUser?.avatar });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
};

export const removeAvatar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req as AuthenticatedRequest;

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { avatar: null },
      { new: true }
    ).select('avatar');

    res.json({ avatar: updatedUser?.avatar });
  } catch (error) {
    console.error('Avatar removal error:', error);
    res.status(500).json({ error: 'Failed to remove avatar' });
  }
};